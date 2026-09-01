import { createClient } from "@/infra/supabase/server";
import { MovementSchema } from "@/modules/shared/utils/schemas";
import { z } from "zod";
import {
  addMonths,
  isMovementAppliedByDate,
  splitInstallmentAmounts,
} from "./movement-series.utils";

export type MovementPayload = z.infer<typeof MovementSchema>;

export { isMovementAppliedByDate } from "./movement-series.utils";

type SaveMovementParams = {
  movementId: number;
  amount: number;
  description: string;
  doneAt: string;
  type: "expense" | "income" | "transfer";
  from: number;
  category?: number;
  where?: number;
  applied: boolean;
  seriesId?: number;
  installmentIndex?: number;
};

export async function saveMovementWithBalance(params: SaveMovementParams) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("save_movement_with_balance", {
    p_movement_id: params.movementId,
    p_amount: params.amount,
    p_description: params.description,
    p_done_at: params.doneAt,
    p_type: params.type,
    p_from: params.from,
    p_applied: params.applied,
    ...(params.category != null ? { p_category: params.category } : {}),
    ...(params.where != null ? { p_where: params.where } : {}),
    ...(params.seriesId != null ? { p_series_id: params.seriesId } : {}),
    ...(params.installmentIndex != null
      ? { p_installment_index: params.installmentIndex }
      : {}),
  });

  if (error) {
    throw error;
  }
}

export async function createRecurringSeries(movement: Extract<
  MovementPayload,
  { type: "expense"; schedule: "recurring" }
>) {
  const supabase = await createClient();
  const startDate = movement.done_at.slice(0, 10);
  const endDate = movement.end_date ? movement.end_date.slice(0, 10) : null;

  const { data: series, error } = await supabase
    .from("movement_series")
    .insert({
      kind: "recurring",
      frequency: movement.frequency,
      amount: movement.amount,
      description: movement.description,
      category: movement.category,
      from: movement.from,
      start_date: startDate,
      end_date: endDate,
      status: "active",
    })
    .select("id")
    .single();

  if (error || !series) {
    throw error ?? new Error("Failed to create recurring series");
  }

  const firstApplied = isMovementAppliedByDate(movement.done_at);

  await saveMovementWithBalance({
    movementId: 0,
    amount: movement.amount,
    description: movement.description,
    doneAt: movement.done_at,
    type: "expense",
    from: movement.from,
    category: movement.category,
    applied: firstApplied,
    seriesId: series.id,
  });

  // If the first occurrence is already applied, enqueue the next one now
  // (cron only creates the next row when it applies a due movement).
  if (firstApplied) {
    const { data: nextDate, error: nextError } = await supabase.rpc(
      "add_frequency_interval",
      {
        p_date: startDate,
        p_frequency: movement.frequency,
      },
    );

    if (nextError) {
      throw nextError;
    }

    if (nextDate && (!endDate || nextDate <= endDate)) {
      const nextDoneAt = new Date(`${nextDate}T12:00:00.000Z`).toISOString();
      await saveMovementWithBalance({
        movementId: 0,
        amount: movement.amount,
        description: movement.description,
        doneAt: nextDoneAt,
        type: "expense",
        from: movement.from,
        category: movement.category,
        applied: false,
        seriesId: series.id,
      });
    } else {
      await supabase
        .from("movement_series")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", series.id);
    }
  }
}

export async function createInstallmentSeries(movement: Extract<
  MovementPayload,
  { type: "expense"; schedule: "installment" }
>) {
  const supabase = await createClient();
  const start = new Date(movement.done_at);
  const startDate = movement.done_at.slice(0, 10);
  const amounts = splitInstallmentAmounts(
    movement.amount,
    movement.installment_count,
  );
  const perAmount = amounts[0]!;

  const { data: series, error } = await supabase
    .from("movement_series")
    .insert({
      kind: "installment",
      frequency: "monthly",
      amount: perAmount,
      total_amount: movement.amount,
      installment_count: movement.installment_count,
      description: movement.description,
      category: movement.category,
      from: movement.from,
      start_date: startDate,
      status: "active",
    })
    .select("id")
    .single();

  if (error || !series) {
    throw error ?? new Error("Failed to create installment series");
  }

  for (let i = 0; i < movement.installment_count; i++) {
    const due = addMonths(start, i);
    const doneAt = due.toISOString();
    await saveMovementWithBalance({
      movementId: 0,
      amount: amounts[i]!,
      description: `${movement.description} (${i + 1}/${movement.installment_count})`,
      doneAt,
      type: "expense",
      from: movement.from,
      category: movement.category,
      applied: isMovementAppliedByDate(doneAt),
      seriesId: series.id,
      installmentIndex: i + 1,
    });
  }
}

export async function updateFutureSeriesMovements(
  seriesId: number,
  data: {
    amount: number;
    description: string;
    category: number;
    from: number;
  },
) {
  const supabase = await createClient();

  const { error: seriesError } = await supabase
    .from("movement_series")
    .update({
      amount: data.amount,
      description: data.description,
      category: data.category,
      from: data.from,
      updated_at: new Date().toISOString(),
    })
    .eq("id", seriesId)
    .eq("status", "active");

  if (seriesError) {
    throw seriesError;
  }

  const { data: pending, error: pendingError } = await supabase
    .from("movement")
    .select("id, done_at, installment_index")
    .eq("series_id", seriesId)
    .eq("applied", false);

  if (pendingError) {
    throw pendingError;
  }

  for (const row of pending ?? []) {
    await saveMovementWithBalance({
      movementId: row.id,
      amount: data.amount,
      description: data.description,
      doneAt: row.done_at,
      type: "expense",
      from: data.from,
      category: data.category,
      applied: false,
      seriesId,
      installmentIndex: row.installment_index ?? undefined,
    });
  }
}

export async function applyMovementNow(movementId: number) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("apply_movement", {
    p_movement_id: movementId,
    p_set_done_at_now: true,
  });

  if (error) {
    throw error;
  }
}

export type SeriesOccurrence = {
  id: number;
  amount: number;
  doneAt: string;
  applied: boolean;
  installmentIndex: number | null;
};

export type SeriesDetailContext = {
  id: number;
  kind: "recurring" | "installment";
  frequency: "weekly" | "biweekly" | "monthly" | "yearly";
  status: "active" | "completed";
  installmentCount: number | null;
  totalAmount: number | null;
  amount: number;
  endDate: string | null;
  occurrences: SeriesOccurrence[];
};

export async function getSeriesDetailContext(
  seriesId: number,
): Promise<SeriesDetailContext | null> {
  const supabase = await createClient();

  const { data: series, error: seriesError } = await supabase
    .from("movement_series")
    .select(
      "id, kind, frequency, status, installment_count, total_amount, amount, end_date",
    )
    .eq("id", seriesId)
    .single();

  if (seriesError || !series) {
    return null;
  }

  if (series.kind !== "recurring" && series.kind !== "installment") {
    return null;
  }

  const { data: movements, error: movementsError } = await supabase
    .from("movement")
    .select("id, amount, done_at, applied, installment_index")
    .eq("series_id", seriesId)
    .order("done_at", { ascending: true })
    .order("installment_index", { ascending: true });

  if (movementsError) {
    throw movementsError;
  }

  return {
    id: series.id,
    kind: series.kind,
    frequency: series.frequency as SeriesDetailContext["frequency"],
    status: series.status as SeriesDetailContext["status"],
    installmentCount: series.installment_count,
    totalAmount: series.total_amount,
    amount: series.amount,
    endDate: series.end_date,
    occurrences: (movements ?? []).map((m) => ({
      id: m.id,
      amount: Math.abs(m.amount),
      doneAt: m.done_at,
      applied: m.applied,
      installmentIndex: m.installment_index,
    })),
  };
}

