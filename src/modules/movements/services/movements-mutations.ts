import { MovementSchema } from "@/modules/shared/utils/schemas";
import { createClient } from "@/infra/supabase/server";
import z from "zod";
import {
  createInstallmentSeries,
  createRecurringSeries,
  saveMovementWithBalance,
  updateFutureSeriesMovements,
} from "./movement-series";
import { isMovementAppliedByDate } from "./movement-series.utils";

export const insertMovement = async (
  movement: z.infer<typeof MovementSchema>,
) => {
  if (movement.type === "expense" && movement.schedule === "recurring") {
    await createRecurringSeries(movement);
    return;
  }

  if (movement.type === "expense" && movement.schedule === "installment") {
    await createInstallmentSeries(movement);
    return;
  }

  const applied = isMovementAppliedByDate(movement.done_at);
  await saveMovementWithBalance({
    movementId: 0,
    amount: movement.amount,
    description: movement.description,
    doneAt: movement.done_at,
    type: movement.type,
    from: movement.from,
    applied,
    ...(movement.type === "transfer"
      ? { where: movement.where }
      : { category: movement.category }),
  });
};

export const deleteMovement = async (id: number) => {
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_movement_with_balance", {
    p_movement_id: id,
  });

  if (error) {
    throw error;
  }
};

export const updateMovement = async (
  movement: z.infer<typeof MovementSchema>,
  id: number,
  options?: { seriesId?: number | null; updateSeries?: boolean },
) => {
  if (
    options?.updateSeries &&
    options.seriesId &&
    movement.type === "expense"
  ) {
    await updateFutureSeriesMovements(options.seriesId, {
      amount: movement.amount,
      description: movement.description,
      category: movement.category,
      from: movement.from,
    });
    return;
  }

  const applied = isMovementAppliedByDate(movement.done_at);
  await saveMovementWithBalance({
    movementId: id,
    amount: movement.amount,
    description: movement.description,
    doneAt: movement.done_at,
    type: movement.type,
    from: movement.from,
    applied,
    ...(movement.type === "transfer"
      ? { where: movement.where }
      : { category: movement.category }),
  });
};
