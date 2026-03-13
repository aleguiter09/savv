"use client";

import { startTransition, useOptimistic } from "react";
import { CategoryGroup } from "./CategoryGroup";
import { toggleCategoryVisibility } from "../actions/category-action";

export type ParsedCategory = {
  id: number;
  title: string;
  icon: string;
  color: string;
  isHidden: boolean;
  isGlobal: boolean;
  isCustomName: boolean;
};

export type CategoryClient = ParsedCategory & {
  subcategories: ParsedCategory[];
};

export function CategoryClient({
  initialCategories,
}: {
  initialCategories: CategoryClient[];
}) {
  const [categories, setOptimistic] = useOptimistic(
    initialCategories,
    (state, { id, isHidden }) =>
      state.map((category) => {
        if (category.id === id) {
          return { ...category, isHidden };
        }

        const updatedSubcategories = category.subcategories.map((sub) =>
          sub.id === id ? { ...sub, isHidden } : sub,
        );

        if (
          updatedSubcategories.some(
            (sub, index) =>
              sub.isHidden !== category.subcategories[index].isHidden,
          )
        ) {
          return { ...category, subcategories: updatedSubcategories };
        }

        return category;
      }),
  );

  const handleToggle = async (id: number, isHidden: boolean) => {
    startTransition(async () => {
      setOptimistic({ id, isHidden });
      await toggleCategoryVisibility(id, isHidden);
    });
  };

  return (
    <div className="flex flex-col gap-3 mb-4">
      {categories.map((category) => (
        <CategoryGroup
          {...category}
          key={category.id}
          handleToggle={handleToggle}
        />
      ))}
    </div>
  );
}
