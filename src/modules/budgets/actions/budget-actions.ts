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
      error: "validationError",
    };
  }

  try {
    await createBudget(parsed.data);
  } catch {
    return {
      success: false,
      error: "databaseError",
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
      error: "validationError",
    };
  }

  try {
    await updateBudget(budgetId, parsed.data);
  } catch {
    return {
      success: false,
      error: "databaseError",
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
  } catch {
    return {
      success: false,
      error: "databaseError",
    };
  }

  revalidatePath("/home");
  revalidatePath("/settings/budgets");
  return { success: true };
};
