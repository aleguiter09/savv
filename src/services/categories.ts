import type { Category } from "@/types/global.types";
import { createClient } from "@/utils/supabase/server";

export const getCategories = async (): Promise<Category[]> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from("category")
    .select("id, color, title, icon, parent_id");

  return data ?? [];
};

export const getCategoryById = async (
  categoryId: number
): Promise<Category | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("category")
    .select("*")
    .eq("id", categoryId)
    .single();

  return data ?? null;
};

export const getCategoriesByParentId = async (
  parentId: number
): Promise<Category[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("category")
    .select("*")
    .eq("parent_id", parentId);

  return data ?? [];
};

export const createCategory = async (category: Category) => {
  const supabase = await createClient();
  return await supabase.from("category").insert(category);
};

export const deleteCategory = async (categoryId: number) => {
  const supabase = await createClient();
  return await supabase.from("category").delete().eq("id", categoryId);
};

export const updateCategory = async (
  category: Category,
  categoryId: number
) => {
  const supabase = await createClient();
  return await supabase.from("category").update(category).eq("id", categoryId);
};
