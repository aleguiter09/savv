import { createClient } from "@/utils/supabase-server";
import { SupabaseClient } from "@supabase/supabase-js";

export const getCategories = async () => {
  const supabase = await createClient();

  const { data } = await supabase
    .from("category")
    .select("id, color, title, icon, for");
  return data ?? [];
};

export const getCategoryById = async (supabase: SupabaseClient, id: string) => {
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
