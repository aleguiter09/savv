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

export type SeriesSummaryCategory = {
  id: string;
  title: string;
  icon: string;
  color: string;
  isGlobal: boolean;
  isCustomName: boolean;
};

export type SeriesSummary = {
  id: number;
  kind: "recurring" | "installment";
  frequency: SeriesDetailContext["frequency"];
  description: string;
  amount: number;
  totalAmount: number | null;
  installmentCount: number | null;
  paidCount: number;
  remainingAmount: number;
  endDate: string | null;
  accountName: string;
  category: SeriesSummaryCategory;
  nextPending: {
    id: number;
    doneAt: string;
    amount: number;
    installmentIndex: number | null;
  } | null;
};

type JoinField<T> = T | T[] | null | undefined;

function unwrapJoin<T>(value: JoinField<T>): T | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value ?? undefined;
}

export async function getActiveSeriesSummaries(
  kind: "recurring" | "installment",
  accountId: string,
): Promise<SeriesSummary[]> {
  const supabase = await createClient();

  let query = supabase
    .from("movement_series")
    .select(
      `id, kind, frequency, amount, total_amount, installment_count, description, end_date, status,
       fullCategory:effective_categories(id, is_global, is_custom_name, title, icon, color),
       fullAccount:from(id, name)`,
    )
    .eq("kind", kind)
    .eq("status", "active")
    .order("start_date", { ascending: true });

  if (accountId !== "all") {
    query = query.eq("from", Number(accountId));
  }

  const { data: seriesRows, error: seriesError } = await query;

  if (seriesError) {
    throw seriesError;
  }

  if (!seriesRows?.length) {
    return [];
  }

  const seriesIds = seriesRows.map((row) => row.id);

  const { data: movements, error: movementsError } = await supabase
    .from("movement")
    .select("id, series_id, amount, done_at, applied, installment_index")
    .in("series_id", seriesIds)
    .order("done_at", { ascending: true })
    .order("installment_index", { ascending: true });

  if (movementsError) {
    throw movementsError;
  }

  const bySeries = new Map<number, typeof movements>();
  for (const movement of movements ?? []) {
    if (movement.series_id == null) continue;
    const list = bySeries.get(movement.series_id) ?? [];
    list.push(movement);
    bySeries.set(movement.series_id, list);
  }

  const summaries: SeriesSummary[] = seriesRows.map((row) => {
    const occurrences = bySeries.get(row.id) ?? [];
    const paidCount = occurrences.filter((o) => o.applied).length;
    const pending = occurrences.filter((o) => !o.applied);
    const remainingAmount = pending.reduce(
      (sum, o) => sum + Math.abs(o.amount),
      0,
    );
    const next = pending[0] ?? null;
    const category = unwrapJoin(row.fullCategory);
    const account = unwrapJoin(row.fullAccount);

    return {
      id: row.id,
      kind: row.kind as SeriesSummary["kind"],
      frequency: row.frequency as SeriesSummary["frequency"],
      description: row.description,
      amount: Math.abs(row.amount),
      totalAmount: row.total_amount,
      installmentCount: row.installment_count,
      paidCount,
      remainingAmount,
      endDate: row.end_date,
      accountName: account?.name ?? "",
      category: {
        id: category?.id?.toString() ?? "",
        title: category?.title ?? "",
        icon: category?.icon ?? "transfer",
        color: category?.color ?? "gray",
        isGlobal: category?.is_global ?? false,
        isCustomName: category?.is_custom_name ?? false,
      },
      nextPending: next
        ? {
            id: next.id,
            doneAt: next.done_at,
            amount: Math.abs(next.amount),
            installmentIndex: next.installment_index,
          }
        : null,
    };
  });

  return summaries.sort((a, b) => {
    const aDate = a.nextPending?.doneAt ?? "";
    const bDate = b.nextPending?.doneAt ?? "";
    return aDate.localeCompare(bDate);
  });
}

export async function cancelSeries(seriesId: number) {
  const supabase = await createClient();

  const { data: pending, error: pendingError } = await supabase
    .from("movement")
    .select("id")
    .eq("series_id", seriesId)
    .eq("applied", false);

  if (pendingError) {
    throw pendingError;
  }

  for (const row of pending ?? []) {
    const { error } = await supabase.rpc("delete_movement_with_balance", {
      p_movement_id: row.id,
    });
    if (error) {
      throw error;
    }
  }

  const { error: seriesError } = await supabase
    .from("movement_series")
    .update({ status: "completed", updated_at: new Date().toISOString() })
    .eq("id", seriesId)
    .eq("status", "active");

  if (seriesError) {
    throw seriesError;
  }
}

