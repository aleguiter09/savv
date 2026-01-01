"use server";
import { ServerActionResponse } from "@/types/general";
import { revalidatePath } from "next/cache";
import {
  deleteMovement,
  insertMovement,
  updateMovement,
} from "@/services/movements";
import { redirect } from "next/navigation";
import { Movement } from "@/types/global.types";
import { setToastMessage } from "@/lib/toast";
import { getTranslations } from "next-intl/server";
import { MovementSchema } from "@/lib/schemas";
import { updateAccountBalances } from "@/services/accounts";
import { z } from "zod";

export const createMovementForm = async (
  data: z.infer<typeof MovementSchema>
): Promise<ServerActionResponse> => {
  const parsed = MovementSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Missing fields. Failed to create the movement",
    };
  }

  try {
    const data = parsed.data;
    await insertMovement({ ...data, done_at: data.done_at.toISOString() });

    const updates = [];

    if (data.type === "transfer") {
      updates.push(
        { account_id: data.from, amount_change: -data.amount },
        { account_id: data.where, amount_change: data.amount }
      );
    } else if (data.type === "expense") {
      updates.push({ account_id: data.from, amount_change: -data.amount });
    } else if (data.type === "income") {
      updates.push({ account_id: data.from, amount_change: data.amount });
    }

    if (updates.length > 0) {
      await updateAccountBalances(updates);
    }
  } catch (error) {
    return {
      success: false,
      error: "Database error: failed to insert movement: " + error,
    };
  }

  const t = await getTranslations("movements");

  setToastMessage("success", t("createdSuccess"));
  revalidatePath("/");
  redirect("/");
};

export const deleteMovementForm = async (movement: Movement) => {
  if (!movement.id || !movement.from) return;

  await deleteMovement(movement.id);

  const updates = [];
  if (movement.type === "transfer") {
    updates.push(
      {
        account_id: movement.from,
        amount_change: -movement.amount,
      },
      {
        account_id: movement.where ?? 0,
        amount_change: movement.amount,
      }
    );
  } else if (movement.type === "expense") {
    updates.push({
      account_id: movement.from,
      amount_change: -movement.amount,
    });
  } else if (movement.type === "income") {
    updates.push({ account_id: movement.from, amount_change: movement.amount });
  }

  if (updates.length > 0) {
    await updateAccountBalances(updates);
  }

  const t = await getTranslations("movements");

  setToastMessage("success", t("deletedSuccess"));
  revalidatePath("/");
  redirect("/");
};

export const updateMovementForm = async (
  previous: Movement,
  data: z.infer<typeof MovementSchema>
): Promise<ServerActionResponse> => {
  const parsed = MovementSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Missing fields. Failed to update the movement",
    };
  }

  try {
    const data = parsed.data;
    await updateMovement(
      { ...data, done_at: data.done_at.toISOString() },
      Number(previous.id)
    );

    const deltas: Record<number, number> = {};
    const addDelta = (acc: number | undefined, amount: number) => {
      if (acc === undefined || Number.isNaN(acc)) return;
      deltas[acc] = (deltas[acc] ?? 0) + amount;
    };

    if (data.type === "transfer") {
      addDelta(data.from, -data.amount);
      addDelta(data.where, data.amount);
    } else if (data.type === "expense") {
      addDelta(data.from, -data.amount);
    } else if (data.type === "income") {
      addDelta(data.from, data.amount);
    }

    if (previous.type === "transfer") {
      addDelta(previous.from, previous.amount);
      addDelta(previous.where as number, -previous.amount);
    } else if (previous.type === "expense") {
      addDelta(previous.from, previous.amount);
    } else if (previous.type === "income") {
      addDelta(previous.from, -previous.amount);
    }

    const updates: { account_id: number; amount_change: number }[] = [];
    Object.entries(deltas).forEach(([accountId, diff]) => {
      if (diff === 0) return;
      updates.push({ account_id: Number(accountId), amount_change: diff });
    });

    if (updates.length > 0) {
      await updateAccountBalances(updates);
    }
  } catch (error) {
    return {
      success: false,
      error: "Database error: failed to update movement: " + error,
    };
  }

  const t = await getTranslations("movements");

  setToastMessage("success", t("updatedSuccess"));
  revalidatePath("/");
  redirect("/");
};
