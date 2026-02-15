"use server";
import { createClient } from "@/infra/supabase/server";

export const updateLanguage = async (language: "es" | "en") => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user?.id) {
    throw new Error("User not found");
  }

  return await supabase
    .from("user_settings")
    .update({ language })
    .eq("user_id", data.user.id);
};

export const createSettings = async (language: "es" | "en") => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user?.id) {
    throw new Error("User not found");
  }

  return await supabase
    .from("user_settings")
    .insert({ user_id: data.user.id, language })
    .select()
    .single();
};
