"use server";

import { CategorySchema } from "@/modules/shared/utils/schemas";
import {
  countChildCategories,
  countMovementsForCategory,
  countSeriesForCategory,
  createCategory,
  deleteBudgetsForCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
  upsertUserCategory,
} from "@/modules/categories/services/categories";
import { getCategoryDeleteBlockReason } from "@/modules/categories/utils/category-delete.utils";
import { revalidatePath } from "next/cache";
import z from "zod";
import type { ServerActionResponse } from "@/modules/shared/types/global.types";

export async function createCategoryForm(
  data: z.infer<typeof CategorySchema>,
): Promise<ServerActionResponse> {
  const parsed = CategorySchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "validationError",
    };
  }

  try {
    await createCategory(parsed.data);
  } catch {
    return {
      success: false,
      error: "databaseError",
    };
  }

  revalidatePath("/settings/categories");
  return { success: true };
}

export async function updateCategoryForm(
  isGlobal: boolean,
  categoryId: number,
  data: z.infer<typeof CategorySchema>,
): Promise<ServerActionResponse> {
  const parsed = CategorySchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "validationError",
    };
  }

  try {
    if (isGlobal) {
      const userCategory = {
        category_id: categoryId,
        custom_name: parsed.data.title,
        custom_icon: parsed.data.icon,
        custom_color: parsed.data.color,
      };

      await upsertUserCategory(userCategory);
    } else {
      await updateCategory(categoryId, parsed.data);
    }
  } catch {
    return {
      success: false,
      error: "databaseError",
    };
  }

  revalidatePath("/settings/categories");
  return { success: true };
}

export const deleteCategoryForm = async (
  id: number,
): Promise<ServerActionResponse> => {
  if (!id) {
    return { success: false, error: "missingIdError" };
  }

  try {
    const category = await getCategoryById(id);
    const [movementCount, seriesCount, childCount] = await Promise.all([
      countMovementsForCategory(id),
      countSeriesForCategory(id),
      countChildCategories(id),
    ]);

    const blockReason = getCategoryDeleteBlockReason({
      isGlobal: category?.is_global ?? false,
      movementCount,
      seriesCount,
      childCount,
    });

    if (blockReason) {
      return { success: false, error: blockReason };
    }

    await deleteBudgetsForCategory(id);
    await deleteCategory(id);
  } catch {
    return {
      success: false,
      error: "databaseError",
    };
  }

  revalidatePath("/settings/categories");
  revalidatePath("/settings/budgets");
  return { success: true };
};

export async function toggleCategoryVisibility(
  categoryId: number,
  is_hidden: boolean,
) {
  const userCategory = {
    category_id: categoryId,
    is_hidden: is_hidden,
  };

  await upsertUserCategory(userCategory);
  revalidatePath("/settings/categories");
}
