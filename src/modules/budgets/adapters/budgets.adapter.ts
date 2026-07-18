import type { CategoryApi } from "@/modules/categories/types/types";
import type { CategoryColors } from "@/modules/shared/types/global.types";
import type {
  BudgetProgressApi,
  BudgetProgressView,
  BudgetView,
} from "../types/types";

type BudgetCategory = Pick<
  CategoryApi,
  "id" | "title" | "icon" | "color" | "is_global" | "is_custom_name"
>;

type BudgetWithCategory = {
  id: number;
  amount: number;
  category_id: number;
  category: BudgetCategory | BudgetCategory[] | null;
};

export const adaptBudget = (
  budget: BudgetWithCategory,
): BudgetView | null => {
  const category = Array.isArray(budget.category)
    ? budget.category[0]
    : budget.category;

  if (!category?.id) return null;

  return {
    id: budget.id.toString(),
    categoryId: category.id.toString(),
    amount: budget.amount,
    categoryTitle: category.title ?? "",
    categoryIcon: category.icon ?? "transfer",
    categoryColor: category.color ?? "gray",
    isGlobal: category.is_global ?? false,
    isCustomName: category.is_custom_name ?? false,
  };
};

export const adaptBudgetProgress = (
  progress: BudgetProgressApi,
  category?: CategoryApi | null,
): BudgetProgressView => ({
  budgetId: progress.budget_id.toString(),
  categoryId: progress.category_id.toString(),
  categoryTitle: progress.category_title,
  categoryIcon: progress.category_icon,
  categoryColor: progress.category_color,
  budgetAmount: progress.budget_amount,
  spentAmount: progress.spent_amount,
  progressPercent: progress.progress_percent,
  isOverBudget: progress.is_over_budget,
  isGlobal: category?.is_global ?? false,
  isCustomName: category?.is_custom_name ?? false,
});
