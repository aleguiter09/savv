"use server";

import { CategorySchema } from "@/lib/schemas";
import { setToastMessage } from "@/lib/toast";
import { createCategory } from "@/services/categories";
import type { ServerActionResponse } from "@/types/general";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

export async function createCategoryForm(
  data: z.infer<typeof CategorySchema>
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
    if (error instanceof Error) {
      console.error("Error creating category:", error.message);
    }

    return {
      success: false,
      error: "databaseError",
    };
  }

  const t = await getTranslations("categories");

  setToastMessage("success", t("createdSuccess"));
  revalidatePath("/settings/categories");
  redirect("/settings/categories");
}
