import type { CategoryApi } from "../types/types";
import { createClient } from "@/infra/supabase/server";
import { CategorySchema } from "@/modules/shared/utils/schemas";
import z from "zod";

export const getCategories = async (): Promise<CategoryApi[]> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from("effective_categories")
    .select()
    .throwOnError();

  return data ?? [];
};

export const getCategoryById = async (
  categoryId: number,
): Promise<CategoryApi | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("effective_categories")
    .select()
    .eq("id", categoryId)
    .single()
    .throwOnError();

  return data ?? null;
};

export const createCategory = async (
  category: z.infer<typeof CategorySchema>,
) => {
  const supabase = await createClient();
  return await supabase.from("category").insert(category).throwOnError();
};

export const deleteCategory = async (categoryId: number) => {
  const supabase = await createClient();
  return await supabase
    .from("category")
    .delete()
    .eq("id", categoryId)
    .throwOnError();
};

export const updateCategory = async (
  categoryId: number,
  category: z.infer<typeof CategorySchema>,
) => {
  const supabase = await createClient();
  return await supabase
    .from("category")
    .update(category)
    .eq("id", categoryId)
    .throwOnError();
};

export const upsertUserCategory = async (
  userCategory: Partial<z.infer<typeof CategorySchema>> & {
    category_id: number;
  },
) => {
  const supabase = await createClient();
  return await supabase
    .from("user_category")
    .upsert(userCategory, { onConflict: "user_id,category_id" })
    .throwOnError();
};

export const deleteUserCategory = async (categoryId: number) => {
  const supabase = await createClient();
  return await supabase
    .from("user_category")
    .delete()
    .eq("category_id", categoryId)
    .throwOnError();
};
