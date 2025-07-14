import { Category } from "@/types/global.types";
import { createClient } from "@/utils/supabase/server";

export const getCategories = async (): Promise<Category[]> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from("category")
    .select("id, color, title, icon, parent_id");

  return data ?? [];
};
