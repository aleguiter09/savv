import { SupabaseClient } from "@supabase/supabase-js";
import { getCategoryById } from "./categories";
import { Category, Movement } from "@/types/database";
import { getInitialAndFinalDate } from "@/utils/common";
import { unstable_noStore as noStore } from "next/cache";
import { getAccountById } from "./accounts";

export const getMovementsByMonthAndYear = async (
  supabase: SupabaseClient,
  year: number,
  month: number
) => {
  const { initialDate, finishDate } = getInitialAndFinalDate(year, month);

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

export const getLastMovements = async (
  supabase: SupabaseClient,
  accountId: number
) => {
  noStore();
  let movements;
  if (accountId !== 0) {
    const { data } = await supabase
      .from("movement")
      .select()
      .eq("from", accountId)
      .order("done_at", { ascending: false })
      .limit(5);

    movements = data;
  } else {
    const { data } = await supabase
      .from("movement")
      .select()
      .order("done_at", { ascending: false })
      .limit(5);

    movements = data;
  }

  if (movements) {
    for (const m of movements) {
      const mov = await getCategoryById(supabase, m.category);
      m.fullCategory = mov;
    }
    return movements;
  }

  return [];
};

export const getMonthIncomes = async (supabase: SupabaseClient) => {
  const { initialDate, finishDate } = getInitialAndFinalDate();

  const { data } = await supabase
    .from("movement")
    .select("amount")
    .eq("type", "income")
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  return data?.reduce((a, b) => a + b.amount, 0) ?? 0;
};

export const getMonthExpenses = async (supabase: SupabaseClient) => {
  const { initialDate, finishDate } = getInitialAndFinalDate();

  const { data } = await supabase
    .from("movement")
    .select("amount")
    .eq("type", "expense")
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  return data?.reduce((a, b) => a + b.amount, 0) ?? 0;
};

export const getMovementById = async (supabase: SupabaseClient, id: number) => {
  const { data } = await supabase
    .from("movement")
    .select()
    .eq("id", id)
    .single();

  if (data) {
    const category = await getCategoryById(supabase, data.category);
    const account = await getAccountById(supabase, data.from);
    data.fullCategory = category;
    data.fullAccount = account;
  }

  return data;
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

export const getExpenses = async (
  supabase: SupabaseClient,
  accountId: number,
  year?: number,
  month?: number
) => {
  const { initialDate, finishDate } = getInitialAndFinalDate(year, month);

  let movements:
    | {
        amount: number;
        category: string;
        fullCategory?: Category | null;
      }[]
    | null;

  if (accountId !== 0) {
    const { data } = await supabase
      .from("movement")
      .select("amount, category")
      .eq("type", "expense")
      .eq("from", accountId)
      .gte("done_at", initialDate)
      .lte("done_at", finishDate);

    movements = data;
  } else {
    const { data } = await supabase
      .from("movement")
      .select("amount, category")
      .eq("type", "expense")
      .gte("done_at", initialDate)
      .lte("done_at", finishDate);

    movements = data;
  }

  if (movements) {
    for (const d of movements) {
      const mov = await getCategoryById(supabase, d.category);
      d.fullCategory = mov;
    }

    return movements;
  }
  return [];
};
