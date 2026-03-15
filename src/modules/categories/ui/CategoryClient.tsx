"use client";

import { startTransition, useOptimistic } from "react";
import { CategoryGroup } from "./CategoryGroup";
import { toggleCategoryVisibility } from "../actions/categories.action";
import { CategoryView } from "../types/types";

export type CategoryClient = CategoryView & {
  subcategories: CategoryView[];
};

export function CategoryClient({
  initialCategories,
}: {
  initialCategories: CategoryClient[];
}) {
  const [categories, setOptimistic] = useOptimistic(
    initialCategories,
    (state, { id, isHidden }) =>
      state
        .map((category) => {
          if (category.id === id) {
            return { ...category, isHidden };
          }

          const updatedSubcategories = category.subcategories
            .map((sub) => (sub.id === id ? { ...sub, isHidden } : sub))
            .sort((a, b) => {
              if (a.isHidden === b.isHidden) {
                return a.title.localeCompare(b.title);
              }
              return a.isHidden ? 1 : -1;
            });

          if (
            updatedSubcategories.some(
              (sub, index) =>
                sub.isHidden !== category.subcategories[index].isHidden,
            )
          ) {
            return { ...category, subcategories: updatedSubcategories };
          }

          return category;
        })
        .sort((a, b) => {
          if (a.isHidden === b.isHidden) {
            return a.title.localeCompare(b.title);
          }
          return a.isHidden ? 1 : -1;
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
