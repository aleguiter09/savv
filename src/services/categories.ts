import { SupabaseClient } from "@supabase/supabase-js";

export const getExpenseCategories = async (supabase: SupabaseClient) => {
  const { data } = await supabase
    .from("category")
    .select("id, color, title, icon, for")
    .filter("for", "eq", "expense");
  return data ?? [];
};

export const getIncomeCategories = async (supabase: SupabaseClient) => {
  const { data } = await supabase
    .from("category")
    .select("id, color, title, icon, for")
    .filter("for", "eq", "income");
  return data ?? [];
};

export const getAllCategories = async (supabase: SupabaseClient) => {
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
