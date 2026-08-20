"use server";

import { CategorySchema } from "@/modules/shared/utils/schemas";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  upsertUserCategory,
} from "@/modules/categories/services/categories";
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
      error: "Missing fields. Failed to create a category.",
    };
  }

  try {
    await createCategory(parsed.data);
  } catch (error) {
    return {
      success: false,
      error: "databaseError" + error,
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
      error: "Missing fields. Failed to update the category.",
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
  } catch (error) {
    return {
      success: false,
      error: "Database error: failed to update category: " + error,
    };
  }

  revalidatePath("/settings/categories");
  return { success: true };
}

export const deleteCategoryForm = async (
  id: number,
): Promise<ServerActionResponse> => {
  if (!id) {
    return { success: false, error: "Missing category id." };
  }

  try {
    await deleteCategory(id);
  } catch (error) {
    return {
      success: false,
      error: "Database error: failed to delete category: " + error,
    };
  }

  revalidatePath("/settings/categories");
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
