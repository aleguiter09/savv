import { EffectiveCategory } from "@/modules/shared/types/global.types";
import { CategoryFormProps } from "../ui/CategoryForm";

export function mapCategories(categories: EffectiveCategory[]) {
  const parentCategories = categories.filter(
    (category) => category.parent_id === null,
  );

  const mappedCategories = parentCategories.map((category) => {
    const children = categories.filter(
      (child) => child.parent_id === category.id,
    );

    return {
      ...category,
      children,
    };
  });

  return mappedCategories;
}

export const adaptCategoryToForm = (
  category: EffectiveCategory,
): CategoryFormProps => {
  return {
    id: category.id ?? undefined,
    title: category.title ?? "",
    icon: category.icon ?? "",
    color: category.color ?? undefined,
    parentId: category.parent_id ?? undefined,
    isGlobal: category.is_global ?? false,
  };
};
