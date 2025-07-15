import { Category } from "@/types/global.types";
import { createClient } from "@/utils/supabase/server";

export const getCategories = async (): Promise<Category[]> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from("category")
    .select("id, color, title, icon, parent_id");

  return data ?? [];
};

export const getCategoryById = async (categoryId: number) => {
  const supabase = await createClient();
  return await supabase.from("category").select("*").eq("id", categoryId);
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
