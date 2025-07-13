import { Category } from "@/types/database";
import { createClient } from "@/utils/supabase/server";

export const getCategories = async (): Promise<Category[]> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from("category")
    .select("id, color, title, icon, for");

  return data ?? [];
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  const supabase = await createClient();

  if (id) {
    const { data } = await supabase
      .from("category")
      .select("id, color, title, icon, for")
      .eq("id", id)
      .single();

    return data;
  } else {
    const { data } = await supabase
      .from("category")
      .select("id, color, title, icon, for")
      .eq("for", "transfer")
      .single();

    return data;
  }
};
