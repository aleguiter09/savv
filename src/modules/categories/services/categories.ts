import type { CategoryApi } from "../types/types";
import { createClient } from "@/infra/supabase/server";
import { CategorySchema } from "@/modules/shared/utils/schemas";
import { cache } from "react";
import z from "zod";

export const getCategories = cache(async (): Promise<CategoryApi[]> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from("effective_categories")
    .select()
    .throwOnError();

  return data ?? [];
});

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

export const countMovementsForCategory = async (
  categoryId: number,
): Promise<number> => {
  const supabase = await createClient();
  const { count } = await supabase
    .from("movement")
    .select("id", { count: "exact", head: true })
    .eq("category", categoryId)
    .throwOnError();

  return count ?? 0;
};

export const countSeriesForCategory = async (
  categoryId: number,
): Promise<number> => {
  const supabase = await createClient();
  const { count } = await supabase
    .from("movement_series")
    .select("id", { count: "exact", head: true })
    .eq("category", categoryId)
    .throwOnError();

  return count ?? 0;
};

export const countChildCategories = async (
  categoryId: number,
): Promise<number> => {
  const supabase = await createClient();
  const { count } = await supabase
    .from("category")
    .select("id", { count: "exact", head: true })
    .eq("parent_id", categoryId)
    .throwOnError();

  return count ?? 0;
};

export const deleteBudgetsForCategory = async (categoryId: number) => {
  const supabase = await createClient();
  return await supabase
    .from("category_budget")
    .delete()
    .eq("category_id", categoryId)
    .throwOnError();
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
