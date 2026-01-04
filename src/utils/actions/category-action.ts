"use server";

import { CategorySchema } from "@/lib/schemas";
import { ServerActionResponse } from "@/types/general";
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

  return {
    success: true,
  };
}
