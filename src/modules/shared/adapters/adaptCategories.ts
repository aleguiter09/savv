import type { Category } from "../types/global.types";

export function adaptCategories(categories: Category[]) {
  const INCOME_PARENT_ID = 60;

  return {
    incomeCategories: categories.filter(
      (c) => c.parent_id === INCOME_PARENT_ID,
    ),
    expenseCategories: categories.filter(
      (c) => c.parent_id !== null && c.parent_id !== INCOME_PARENT_ID,
    ),
    parentCategories: categories.filter((c) => c.parent_id === null),
  };
}
