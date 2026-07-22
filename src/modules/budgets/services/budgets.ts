import { getCategories } from "@/modules/categories/services/categories";
import { createClient } from "@/infra/supabase/server";
import { BudgetSchema } from "@/modules/shared/utils/schemas";
import { cache } from "react";
import z from "zod";
import {
  adaptBudget,
  adaptBudgetProgress,
} from "../adapters/budgets.adapter";
import type { BudgetProgressView, BudgetView } from "../types/types";

export const getBudgets = cache(async (): Promise<BudgetView[]> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from("category_budget")
    .select(
      "id, amount, category_id, category:effective_categories(id, title, icon, color, is_global, is_custom_name)",
    )
    .order("created_at", { ascending: false })
    .throwOnError();

  return (data ?? [])
    .map(adaptBudget)
    .filter((budget): budget is BudgetView => budget !== null);
});

export const getBudgetById = async (id: number): Promise<BudgetView | null> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from("category_budget")
    .select(
      "id, amount, category_id, category:effective_categories(id, title, icon, color, is_global, is_custom_name)",
    )
    .eq("id", id)
    .single()
    .throwOnError();

  return data ? adaptBudget(data) : null;
};

export const getBudgetProgress = async (
  accountId: string,
): Promise<BudgetProgressView[]> => {
  const supabase = await createClient();
  const [categories, progressResult] = await Promise.all([
    getCategories(),
    supabase.rpc("get_category_budget_progress", {
      p_account_id:
        accountId === "all" ? undefined : Number.parseInt(accountId),
    }),
  ]);

  if (progressResult.error) {
    throw progressResult.error;
  }

  const categoryMap = new Map(
    categories
      .filter((category) => category.id !== null)
      .map((category) => [category.id!, category]),
  );

  return (progressResult.data ?? []).map((item) =>
    adaptBudgetProgress(item, categoryMap.get(item.category_id)),
  );
};

export const createBudget = async (budget: z.infer<typeof BudgetSchema>) => {
  const supabase = await createClient();
  return await supabase.from("category_budget").insert(budget).throwOnError();
};

export const updateBudget = async (
  id: number,
  budget: z.infer<typeof BudgetSchema>,
) => {
  const supabase = await createClient();
  return await supabase
    .from("category_budget")
    .update(budget)
    .eq("id", id)
    .throwOnError();
};

export const deleteBudget = async (id: number) => {
  const supabase = await createClient();
  return await supabase
    .from("category_budget")
    .delete()
    .eq("id", id)
    .throwOnError();
};
