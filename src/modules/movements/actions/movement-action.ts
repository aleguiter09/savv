"use server";
import { revalidatePath } from "next/cache";
import {
  deleteMovement,
  insertMovement,
  updateMovement,
} from "@/modules/movements/services/movements";
import { redirect } from "next/navigation";
import { setToastMessage } from "@/modules/shared/actions/toast";
import { getTranslations } from "next-intl/server";
import { MovementSchema } from "@/modules/shared/utils/schemas";
import { updateAccountBalances } from "@/modules/accounts/services/accounts";
import { z } from "zod";
import { ServerActionResponse } from "@/modules/shared/types/global.types";
import { MovementView } from "../types/types";

export const createMovementForm = async (
  data: z.infer<typeof MovementSchema>,
): Promise<ServerActionResponse> => {
  const parsed = MovementSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Missing fields. Failed to create the movement",
    };
  }

  try {
    await insertMovement(parsed.data);

    const updates = [];

    if (parsed.data.type === "transfer") {
      updates.push(
        {
          account_id: parsed.data.from.toString(),
          amount_change: -parsed.data.amount,
        },
        {
          account_id: parsed.data.where.toString(),
          amount_change: parsed.data.amount,
        },
      );
    } else if (parsed.data.type === "expense") {
      updates.push({
        account_id: parsed.data.from.toString(),
        amount_change: -parsed.data.amount,
      });
    } else if (parsed.data.type === "income") {
      updates.push({
        account_id: parsed.data.from.toString(),
        amount_change: parsed.data.amount,
      });
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

export const deleteMovementForm = async (movement: MovementView) => {
  if (!movement.id || !movement.account?.id) return;

  await deleteMovement(movement.id);

  console.log(movement);
  const updates = [];
  if (movement.type === "transfer") {
    updates.push(
      {
        account_id: movement.account.id,
        amount_change: movement.amount,
      },
      {
        account_id: movement.where?.id ?? "0",
        amount_change: -movement.amount,
      },
    );
  } else if (movement.type === "expense") {
    updates.push({
      account_id: movement.account.id,
      amount_change: movement.amount,
    });
  } else if (movement.type === "income") {
    updates.push({
      account_id: movement.account.id,
      amount_change: -movement.amount,
    });
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
  previous: MovementView,
  data: z.infer<typeof MovementSchema>,
): Promise<ServerActionResponse> => {
  const parsed = MovementSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Missing fields. Failed to update movement",
    };
  }

  try {
    const newData = parsed.data;

    let balanceAfter = previous.balanceAfter ?? 0;

    if (newData.amount !== previous.amount) {
      const amountDiff = newData.amount - previous.amount;

      if (newData.type === "income") {
        balanceAfter += amountDiff;
      } else if (newData.type === "expense") {
        balanceAfter -= amountDiff;
      } else if (newData.type === "transfer") {
        balanceAfter -= amountDiff;
      }
    }

    const movementWithBalance = {
      ...newData,
      balance_after: balanceAfter,
    };

    await updateMovement(movementWithBalance, Number(previous.id));

    const deltas: Record<string, number> = {};
    const addDelta = (acc: string | undefined, amount: number) => {
      if (acc === undefined || Number.isNaN(acc)) return;
      deltas[acc] = (deltas[acc] ?? 0) + amount;
    };

    if (newData.type === "transfer") {
      addDelta(newData.from.toString(), -newData.amount);
      addDelta(newData.where.toString(), newData.amount);
    } else if (newData.type === "expense") {
      addDelta(newData.from.toString(), -newData.amount);
    } else if (newData.type === "income") {
      addDelta(newData.from.toString(), newData.amount);
    }

    if (previous.type === "transfer") {
      addDelta(previous.account.id, previous.amount);
      addDelta(previous.where?.id, -previous.amount);
    } else if (previous.type === "expense") {
      addDelta(previous.account.id, previous.amount);
    } else if (previous.type === "income") {
      addDelta(previous.account.id, -previous.amount);
    }

    const updates: { account_id: string; amount_change: number }[] = [];
    Object.entries(deltas).forEach(([accountId, diff]) => {
      if (diff === 0) return;
      updates.push({ account_id: accountId, amount_change: diff });
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
