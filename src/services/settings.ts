import { createClient } from "@/utils/supabase-browser";

export const updateLanguage = async (language: "es" | "en") => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  return await supabase
    .from("user_settings")
    .update({ language })
    .eq("user_id", data.user?.id);
};

export const createSettings = async (language: "es" | "en") => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  return await supabase
    .from("user_settings")
    .insert({ user_id: data.user?.id, language })
    .select()
    .single();
};
