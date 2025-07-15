"use server";

import { CategorySchema } from "@/lib/schemas";
import { FormCategoryState } from "@/types/general";

export async function createCategoryForm(
  prevState: FormCategoryState,
  formData: FormData
): Promise<FormCategoryState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedData = CategorySchema.safeParse(rawFormData);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create a category.",
    };
  }

  return {
    message: "Category created successfully",
    errors: {},
  };
}
