import { CategoryView } from "@/modules/categories/types/types";

export function adaptCategories(categories: CategoryView[]) {
  const INCOME_PARENT_ID = "60";

  return {
    incomeCategories: categories.filter((c) => c.parentId === INCOME_PARENT_ID),
    expenseCategories: categories.filter(
      (c) => c.parentId !== null && c.parentId !== INCOME_PARENT_ID,
    ),
    parentCategories: categories.filter((c) => c.parentId === null),
  };
}
