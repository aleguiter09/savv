import { CategoryView } from "@/modules/categories/types/types";
import type { BudgetView } from "@/modules/budgets/types/types";

export function getAvailableBudgetCategories(
  expenseCategories: CategoryView[],
  budgets: BudgetView[],
  editingBudget?: BudgetView,
): CategoryView[] {
  const budgetedCategoryIds = new Set(
    budgets
      .filter((budget) => budget.id !== editingBudget?.id)
      .map((budget) => Number(budget.categoryId)),
  );

  return expenseCategories.filter(
    (category) =>
      !category.isHidden && !budgetedCategoryIds.has(Number(category.id)),
  );
}
