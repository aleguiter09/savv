"use server";
import { FormMovementState } from "@/types/general";
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

export const createMovementForm = async (
  prevState: FormMovementState,
  formData: FormData
): Promise<FormMovementState> => {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedData = MovementSchema.safeParse(rawFormData);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create the movement",
    };
  }

  try {
    const data = validatedData.data;
    await insertMovement(data);

    const updates = [];

    if (data.type === "transfer") {
      updates.push({ account_id: data.from, amount_change: -data.amount });
      updates.push({ account_id: data.where, amount_change: data.amount });
    } else if (data.type === "expense") {
      updates.push({ account_id: data.from, amount_change: -data.amount });
    } else if (data.type === "income") {
      updates.push({ account_id: data.from, amount_change: data.amount });
    }

    if (updates.length > 0) {
      await updateAccountBalances(updates);
    }
  } catch (error) {
    console.error("Database error: failed to insert movement", error);
    throw new Error("Database error: failed to insert movement");
  }

  const t = await getTranslations("movements");

  setToastMessage("success", t("createdSuccess"));
  revalidatePath("/");
  redirect("/");
};

export const deleteMovementForm = async (movement: Movement) => {
  await deleteMovement(movement.id ?? 0);

  if (!movement.from) {
    revalidatePath("/");
    redirect("/");
  }

  const updates = [];
  if (movement.type === "transfer") {
    updates.push({
      account_id: movement.from,
      amount_change: -movement.amount,
    });
    updates.push({
      account_id: movement.where ?? 0,
      amount_change: movement.amount,
    });
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
  prevState: FormMovementState,
  formData: FormData
): Promise<FormMovementState> => {
  const rawFormData = Object.fromEntries(formData.entries());

  const previous = {
    id: rawFormData.id as string,
    amount: parseFloat(rawFormData.previousAmount as string),
    from: parseInt(rawFormData.previousFrom as string),
    where: parseInt(rawFormData.previousWhere as string),
    type: rawFormData.previousType,
  };

  delete rawFormData.id;
  delete rawFormData.previousAmount;
  delete rawFormData.previousFrom;
  delete rawFormData.previousWhere;
  delete rawFormData.previousType;

  let validatedData;
  if (rawFormData.type === "transfer") {
    delete rawFormData.category;
    validatedData = MovementSchema.safeParse(rawFormData);
  } else {
    delete rawFormData.where;
    validatedData = MovementSchema.safeParse(rawFormData);
  }

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create the movement",
    };
  }

  try {
    const data = validatedData.data;
    await updateMovement(data, Number(previous.id));

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
      addDelta(previous.where, -previous.amount);
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
    console.error("Database error: failed to update movement", error);
    throw new Error("Database error: failed to update movement");
  }

  const t = await getTranslations("movements");

  setToastMessage("success", t("updatedSuccess"));
  revalidatePath("/");
  redirect("/");
};
