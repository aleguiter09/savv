import { Movement } from "@/types/global.types";
import { getInitialAndFinalDate } from "@/utils/common";
import { createClient } from "@/utils/supabase/server";
import { AccountIds, CategoryIds } from "@/types/general";

export const getMovementsByFilters = async (
  from: Date,
  to: Date,
  accountId: AccountIds,
  categoryId: CategoryIds
): Promise<Movement[]> => {
  const supabase = await createClient();
  const initialDate = from.toISOString();
  const finishDate = to.toISOString();

  let query = supabase
    .from("movement")
    .select(
      `
      id, from, amount, comment, category, type,
      done_at, where,
      fullCategory:category (
        id, title, icon, color, for
      )
    `
    )
    .gte("done_at", initialDate)
    .lte("done_at", finishDate)
    .order("done_at", { ascending: false });

  if (accountId !== "all") {
    query = query.or(`from.eq.${accountId},where.eq.${accountId}`);
  }

  if (!["all", "expenses", "incomes"].includes(categoryId as string)) {
    query = query.eq("category", Number(categoryId));
  }

  if (categoryId === "expenses") {
    query = query.eq("type", "expense");
  } else if (categoryId === "incomes") {
    query = query.eq("type", "income");
  }

  const { data } = await query;

  if (data) {
    return data.map((item) => ({
      ...item,
      fullCategory: Array.isArray(item.fullCategory)
        ? item.fullCategory[0]
        : item.fullCategory,
    }));
  }

  return [];
};

export const getLastMovements = async (accountId: AccountIds) => {
  const supabase = await createClient();

  let query = supabase
    .from("movement")
    .select(
      `
      id,
      from, 
      amount,
      comment,
      category,
      type,
      done_at,
      where,
      fullCategory:category (
        id,
        title,
        icon,
        color,
        for
      )
    `
    )
    .lte("done_at", new Date().toISOString())
    .order("done_at", { ascending: false })
    .limit(5);

  if (accountId !== "all") {
    query = query.or(`from.eq.${accountId},where.eq.${accountId}`);
  }

  const { data } = await query;

  if (data) {
    return data.map((item) => ({
      ...item,
      fullCategory: Array.isArray(item.fullCategory)
        ? item.fullCategory[0]
        : item.fullCategory,
    }));
  }

  return [];
};

export const getUpcomingMovements = async (accountId: AccountIds) => {
  const supabase = await createClient();

  let query = supabase
    .from("movement")
    .select(
      `
      id,
      from, 
      amount,
      comment,
      category,
      type,
      done_at,
      where,
      fullCategory:category (
        id,
        title,
        icon,
        color,
        for
      )
    `
    )
    .gt("done_at", new Date().toISOString())
    .order("done_at", { ascending: false })
    .limit(5);

  if (accountId !== "all") {
    query = query.or(`from.eq.${accountId},where.eq.${accountId}`);
  }

  const { data } = await query;

  if (data) {
    return data.map((item) => ({
      ...item,
      fullCategory: Array.isArray(item.fullCategory)
        ? item.fullCategory[0]
        : item.fullCategory,
    }));
  }

  return [];
};

export const getMonthIncomes = async (accountId: AccountIds) => {
  const supabase = await createClient();
  const { initialDate, finishDate } = getInitialAndFinalDate();
  let query = supabase
    .from("movement")
    .select("amount")
    .eq("type", "income")
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  if (accountId !== "all") {
    query = query.eq("from", accountId);
  }

  const { data } = await query;
  return data?.reduce((a, b) => a + b.amount, 0) ?? 0;
};

export const getMonthExpenses = async (accountId: AccountIds) => {
  const supabase = await createClient();
  const { initialDate, finishDate } = getInitialAndFinalDate();
  let query = supabase
    .from("movement")
    .select("amount")
    .eq("type", "expense")
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  if (accountId !== "all") {
    query = query.eq("from", accountId);
  }

  const { data } = await query;
  return data?.reduce((a, b) => a + b.amount, 0) ?? 0;
};

export const getMovementById = async (id: number): Promise<Movement | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("movement")
    .select(
      `
      id,
      from, 
      amount,
      comment,
      category,
      type,
      done_at,
      where,
      fullCategory:category (
        id,
        title,
        icon,
        color,
        for
      ),
      fullAccount:from (
        id,
        name,
        balance,
        default
      )
    `
    )
    .eq("id", id)
    .single();

  if (data) {
    return {
      ...data,
      fullCategory: Array.isArray(data.fullCategory)
        ? data.fullCategory[0]
        : data.fullCategory,
      fullAccount: Array.isArray(data.fullAccount)
        ? data.fullAccount[0]
        : data.fullAccount,
    };
  }

  return null;
};

export const insertMovement = async (movement: Movement) => {
  const supabase = await createClient();
  return await supabase.from("movement").insert(movement);
};

export const deleteMovement = async (id: number) => {
  const supabase = await createClient();
  return await supabase.from("movement").delete().eq("id", id);
};

export const updateMovement = async (movement: Movement, id: number) => {
  const supabase = await createClient();
  return await supabase.from("movement").update(movement).eq("id", id);
};

export const getExpenses = async (
  accountId: AccountIds,
  year?: number,
  month?: number
): Promise<Movement[]> => {
  const supabase = await createClient();
  const { initialDate, finishDate } = getInitialAndFinalDate(year, month);

  let query = supabase
    .from("movement")
    .select(
      `
      from, 
      amount,
      comment, 
      done_at, 
      type,
      category,
      fullCategory:category (
        id,
        color,
        title,
        icon,
        for
      )
    `
    )
    .eq("type", "expense")
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  if (accountId !== "all") {
    query = query.eq("from", accountId);
  }

  const { data } = await query;

  if (data) {
    return data.map((item) => ({
      ...item,
      fullCategory: Array.isArray(item.fullCategory)
        ? item.fullCategory[0]
        : item.fullCategory,
    }));
  }

  return [];
};
