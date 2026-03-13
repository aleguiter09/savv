import { CategoryFormProps } from "../ui/CategoryForm";
import { CategoryClient } from "../ui/CategoryClient";
import { EffectiveCategory } from "@/modules/shared/types/global.types";

export function mapCategories(
  categories: EffectiveCategory[],
): CategoryClient[] {
  const parentCategories = categories.filter(
    (category) => category.parent_id === null,
  );

  const mappedCategories: CategoryClient[] = parentCategories.map(
    (category) => {
      const subcategories = categories
        .filter((child) => child.parent_id === category.id)
        .map((child) => ({
          id: child.id ?? 0,
          title: child.title ?? "",
          icon: child.icon ?? "transfer",
          color: child.color ?? "gray",
          isHidden: child.is_hidden ?? false,
          isGlobal: child.is_global ?? false,
          isCustomName: child.is_custom_name ?? false,
        }));

      return {
        id: category.id ?? 0,
        title: category.title ?? "",
        icon: category.icon ?? "transfer",
        color: category.color ?? "gray",
        isHidden: category.is_hidden ?? false,
        isGlobal: category.is_global ?? false,
        isCustomName: category.is_custom_name ?? false,
        subcategories,
      };
    },
  );

  return mappedCategories;
}

export const adaptCategoryToForm = (
  category: EffectiveCategory,
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
