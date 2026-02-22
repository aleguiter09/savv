"use server";

import type { ServerActionResponse } from "@/modules/shared/types/general";
import type { Category } from "@/modules/shared/types/global.types";
import { CategorySchema } from "@/modules/shared/utils/schemas";
import { setToastMessage } from "@/modules/shared/actions/toast";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/modules/categories/services/categories";
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

export const deleteCategoryForm = async (id: number) => {
  if (!id) return;
  await deleteCategory(id);

  const t = await getTranslations("categories");

  setToastMessage("success", t("deletedSuccess"));
  revalidatePath("/settings/categories");
  redirect("/settings/categories");
};
