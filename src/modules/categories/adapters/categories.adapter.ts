import { CategoryFormProps } from "../ui/CategoryForm";
import { CategoryClient } from "../ui/CategoryClient";
import { CategoryApi, CategoryView } from "../types/types";

export function mapCategories(categories: CategoryApi[]): CategoryClient[] {
  const parentCategories = categories.filter(
    (category) => category.parent_id === null,
  );

  const mappedCategories: CategoryClient[] = parentCategories
    .map((category) => {
      const subcategories = categories
        .filter((child) => child.parent_id === category.id)
        .map(adaptCategory);

      return {
        ...adaptCategory(category),
        subcategories: subcategories.toSorted((a, b) => {
          if (a.isHidden === b.isHidden) {
            return a.title.localeCompare(b.title);
          }
          return a.isHidden ? 1 : -1;
        }),
      };
    })
    .toSorted((a, b) => {
      if (a.isHidden === b.isHidden) {
        return a.title.localeCompare(b.title);
      }
      return a.isHidden ? 1 : -1;
    });

  return mappedCategories;
}

export const adaptCategoryToForm = (
  category: CategoryApi,
): CategoryFormProps => {
  return {
    id: category.id ?? undefined,
    title: category.title ?? "",
    icon: category.icon ?? "transfer",
    color: category.color ?? undefined,
    parentId: category.parent_id ?? undefined,
    isGlobal: category.is_global ?? false,
  };
};

export const adaptCategory = (category: CategoryApi): CategoryView => {
  return {
    id: category.id?.toString() ?? "",
    title: category.title ?? "",
    icon: category.icon ?? "transfer",
    color: category.color ?? "gray",
    isHidden: category.is_hidden ?? false,
    isGlobal: category.is_global ?? false,
    isCustomName: category.is_custom_name ?? false,
    parentId: category.parent_id?.toString() ?? null,
  };
};
