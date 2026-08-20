"use server";

import {
  createBudget,
  deleteBudget,
  updateBudget,
} from "@/modules/budgets/services/budgets";
import type { ServerActionResponse } from "@/modules/shared/types/global.types";
import { BudgetSchema } from "@/modules/shared/utils/schemas";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function createBudgetForm(
  data: z.infer<typeof BudgetSchema>,
): Promise<ServerActionResponse> {
  const parsed = BudgetSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Missing fields. Failed to create a budget.",
    };
  }

  try {
    await createBudget(parsed.data);
  } catch (error) {
    return {
      success: false,
      error: "databaseError" + error,
    };
  }

  revalidatePath("/home");
  revalidatePath("/settings/budgets");
  return { success: true };
}

export async function updateBudgetForm(
  budgetId: number,
  data: z.infer<typeof BudgetSchema>,
): Promise<ServerActionResponse> {
  const parsed = BudgetSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Missing fields. Failed to update the budget.",
    };
  }

  try {
    await updateBudget(budgetId, parsed.data);
  } catch (error) {
    return {
      success: false,
      error: "Database error: failed to update budget: " + error,
    };
  }

  revalidatePath("/home");
  revalidatePath("/settings/budgets");
  return { success: true };
}

export const deleteBudgetForm = async (
  budgetId: number,
): Promise<ServerActionResponse> => {
  try {
    await deleteBudget(budgetId);
  } catch (error) {
    return {
      success: false,
      error: "Database error: failed to delete budget: " + error,
    };
  }

  revalidatePath("/home");
  revalidatePath("/settings/budgets");
  return { success: true };
};
