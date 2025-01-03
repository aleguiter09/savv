import { SupabaseClient } from "@supabase/supabase-js";
import { getCategoryById } from "./categories";
import { Movement } from "@/types/database";
import { getInitialAndFinalDate } from "@/utils/common";
import { unstable_noStore as noStore } from "next/cache";
import { getAccountById } from "./accounts";

export const getMovementsByFilters = async (
  supabase: SupabaseClient,
  from: Date,
  to: Date,
  accountId: number,
  categoryId: number
) => {
  const initialDate = from.toISOString();
  const finishDate = to.toISOString();

  let query = supabase
    .from("movement")
    .select("*")
    .gte("done_at", initialDate)
    .lte("done_at", finishDate)
    .order("done_at", { ascending: false });

  if (accountId !== 0) {
    query = query.eq("from", accountId);
  }

  if (categoryId !== 0) {
    query = query.eq("category", categoryId);
  }

  const { data } = await query;

  if (data) {
    for (const d of data) {
      const mov = await getCategoryById(supabase, d.category);
      d.fullCategory = mov;
    }
    return { data };
  }
  return { data: [] };
};

export const getLastMovements = async (
  supabase: SupabaseClient,
  accountId: number
) => {
  noStore();
  let query = supabase
    .from("movement")
    .select()
    .order("done_at", { ascending: false })
    .limit(5);

  if (accountId !== 0) {
    query = query.eq("from", accountId);
  }

  const { data } = await query;

  if (data) {
    for (const m of data) {
      const mov = await getCategoryById(supabase, m.category);
      m.fullCategory = mov;
    }
    return data;
  }

  return [];
};

export const getMonthIncomes = async (
  supabase: SupabaseClient,
  accountId: number
) => {
  const { initialDate, finishDate } = getInitialAndFinalDate();
  let query = supabase
    .from("movement")
    .select("amount")
    .eq("type", "income")
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  if (accountId !== 0) {
    query = query.eq("from", accountId);
  }
  const { data } = await query;
  return data?.reduce((a, b) => a + b.amount, 0) ?? 0;
};

export const getMonthExpenses = async (
  supabase: SupabaseClient,
  accountId: number
) => {
  const { initialDate, finishDate } = getInitialAndFinalDate();
  let query = supabase
    .from("movement")
    .select("amount")
    .eq("type", "expense")
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  if (accountId !== 0) {
    query = query.eq("type", "expense");
  }
  const { data } = await query;

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

  let query = supabase
    .from("movement")
    .select("amount, category")
    .eq("type", "expense")
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  if (accountId !== 0) {
    query = query.eq("from", accountId);
  }

  const { data } = await query;

  if (data) {
    const dataWithCategory = [];
    for (const d of data) {
      const mov = await getCategoryById(supabase, d.category);
      const movWithCategory = { ...d, fullCategory: mov };
      dataWithCategory.push(movWithCategory);
    }

    return dataWithCategory;
  }

  return [];
};
