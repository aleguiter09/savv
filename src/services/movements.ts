import { SupabaseClient } from "@supabase/supabase-js";
import { getCategoryById } from "./categories";
import { Movement } from "@/types/database";

export const getMovementsByMonthAndYear = async (
  supabase: SupabaseClient,
  year: number,
  month: number
) => {
  const initialDate = new Date(year, month).toISOString();
  const partialDate = new Date(year, month + 1, 1);
  const finishDate = new Date(
    partialDate.getTime() - 24 * 60 * 60 * 1000
  ).toISOString();
  const { data } = await supabase
    .from("movement")
    .select()
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  if (data) {
    for (const d of data) {
      const mov = await getCategoryById(supabase, d.category);
      d.fullCategory = mov;
    }

    return data;
  }
  return [];
};

export const getLastMovements = async (supabase: SupabaseClient) => {
  const { data } = await supabase
    .from("movement")
    .select()
    .order("done_at", { ascending: false })
    .limit(5);

  if (data) {
    for (const d of data) {
      const mov = await getCategoryById(supabase, d.category);
      d.fullCategory = mov;
    }

    return data;
  }
  return [];
};

export const getMonthIncomes = async (supabase: SupabaseClient) => {
  const initialDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth()
  ).toISOString();
  const partialDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1
  );
  const finishDate = new Date(
    partialDate.getTime() - 24 * 60 * 60 * 1000
  ).toISOString();

  const { data } = await supabase
    .from("movement")
    .select("amount")
    .eq("type", "income")
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  return data?.reduce((a, b) => a + b.amount, 0) || 0;
};

export const getMonthExpenses = async (supabase: SupabaseClient) => {
  const initialDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth()
  ).toISOString();
  const partialDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1
  );
  const finishDate = new Date(
    partialDate.getTime() - 24 * 60 * 60 * 1000
  ).toISOString();

  const { data } = await supabase
    .from("movement")
    .select("amount")
    .eq("type", "expense")
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  return data?.reduce((a, b) => a + b.amount, 0) || 0;
};

export const insertMovement = async (
  supabase: SupabaseClient,
  movement: Movement
) => {
  return await supabase.from("movement").insert(movement);
};

export const deleteMovement = async (
  supabase: SupabaseClient,
  movementId: string
) => {
  return await supabase.from("movement").delete().eq("id", movementId);
};

export const updateMovement = async (
  supabase: SupabaseClient,
  movement: Movement,
  movementId: string
) => {
  return await supabase.from("movement").update(movement).eq("id", movementId);
};
