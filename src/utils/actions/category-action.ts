"use server";

import type { ServerActionResponse } from "@/types/general";
import type { Category } from "@/types/global.types";
import { CategorySchema } from "@/lib/schemas";
import { setToastMessage } from "@/lib/toast";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/services/categories";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

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

  const t = await getTranslations("categories");

  setToastMessage("success", t("createdSuccess"));
  revalidatePath("/settings/categories");
  redirect("/settings/categories");
}

export async function updateCategoryForm(
  category: Category,
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
    await updateCategory(parsed.data, category.id!);
  } catch (error) {
    return {
      success: false,
      error: "Database error: failed to update category: " + error,
    };
  }

  const t = await getTranslations("categories");

  setToastMessage("success", t("updatedSuccess"));
  revalidatePath("/settings/categories");
  redirect("/settings/categories");
}

export const deleteCategoryForm = async (category: Category) => {
  if (!category.id) return;
  await deleteCategory(category.id);

  const t = await getTranslations("categories");

  setToastMessage("success", t("deletedSuccess"));
  revalidatePath("/settings/categories");
  redirect("/settings/categories");
};
