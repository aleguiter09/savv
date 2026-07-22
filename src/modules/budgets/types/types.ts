import type { CategoryColors } from "@/modules/shared/types/global.types";
import type { Database } from "@/modules/shared/types/database.types";

export type CategoryBudgetApi =
  Database["public"]["Tables"]["category_budget"]["Row"];

export type BudgetProgressApi =
  Database["public"]["Functions"]["get_category_budget_progress"]["Returns"][number];

export type BudgetView = {
  id: string;
  categoryId: string;
  amount: number;
  categoryTitle: string;
  categoryIcon: string;
  categoryColor: CategoryColors;
  isGlobal: boolean;
  isCustomName: boolean;
};

export type BudgetProgressView = {
  budgetId: string;
  categoryId: string;
  categoryTitle: string;
  categoryIcon: string;
  categoryColor: CategoryColors;
  budgetAmount: number;
  spentAmount: number;
  progressPercent: number;
  isOverBudget: boolean;
  isGlobal: boolean;
  isCustomName: boolean;
};
