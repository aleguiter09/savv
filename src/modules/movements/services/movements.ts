import { type MovementApi } from "../types/types";
import { getInitialAndFinalDate } from "@/modules/shared/utils/common";
import { createClient } from "@/infra/supabase/server";
import { MovementSchema } from "@/modules/shared/utils/schemas";
import z from "zod";

export const getMovementsByFilters = async (
  from: Date,
  to: Date,
  accountId: string,
  categoryId: string,
): Promise<MovementApi[]> => {
  const supabase = await createClient();
  const initialDate = from.toISOString();
  const finishDate = to.toISOString();

  let query = supabase
    .from("movement")
    .select(
      `id, from, amount, description, category, type, done_at, balance_after, fullCategory:effective_categories(id, is_global, is_custom_name, title, icon, color)`,
    )
    .gte("done_at", initialDate)
    .lte("done_at", finishDate)
    .order("done_at", { ascending: false });

  if (accountId !== "all") {
    query = query.eq("from", Number(accountId));
  }

  if (!["all", "expenses", "incomes"].includes(categoryId)) {
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

export const getLastMovements = async (
  accountId: string,
): Promise<MovementApi[]> => {
  const supabase = await createClient();

  let query = supabase
    .from("movement")
    .select(
      `id, from, amount, description, category, type, done_at, balance_after, fullCategory:effective_categories(id, is_global, is_custom_name, title, icon, color)`,
    )
    .lte("done_at", new Date().toISOString())
    .order("done_at", { ascending: false })
    .limit(5);

  if (accountId !== "all") {
    query = query.eq("from", Number(accountId));
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

export const getUpcomingMovements = async (
  accountId: string,
): Promise<MovementApi[]> => {
  const supabase = await createClient();

  let query = supabase
    .from("movement")
    .select(
      `id, from, amount, description, category, type, done_at, balance_after, fullCategory:effective_categories(id, is_global, is_custom_name, title, icon, color)`,
    )
    .gt("done_at", new Date().toISOString())
    .order("done_at", { ascending: false })
    .limit(5);

  if (accountId !== "all") {
    query = query.eq("from", Number(accountId));
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

export const getMonthIncomes = async (accountId: string) => {
  const supabase = await createClient();
  const { initialDate, finishDate } = getInitialAndFinalDate();
  let query = supabase
    .from("movement")
    .select("amount")
    .eq("type", "income")
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  if (accountId !== "all") {
    query = query.eq("from", Number.parseInt(accountId));
  }

  const { data } = await query;
  return data?.reduce((a, b) => a + b.amount, 0) ?? 0;
};

export const getMonthExpenses = async (accountId: string) => {
  const supabase = await createClient();
  const { initialDate, finishDate } = getInitialAndFinalDate();
  let query = supabase
    .from("movement")
    .select("amount")
    .eq("type", "expense")
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  if (accountId !== "all") {
    query = query.eq("from", Number.parseInt(accountId));
  }

  const { data } = await query;
  return Math.abs(data?.reduce((a, b) => a + b.amount, 0) ?? 0);
};

export const getMovementById = async (
  id: number,
): Promise<MovementApi | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("movement")
    .select(
      `id, from, amount, description, category, type, done_at, balance_after, fullCategory:effective_categories(id, is_global, is_custom_name, title, icon, color), fullAccount:from(id, name, balance, is_default)`,
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

export const insertMovement = async (
  movement: z.infer<typeof MovementSchema>,
) => {
  const supabase = await createClient();
  const { error } = await supabase.rpc("save_movement_with_balance", {
    p_movement_id: 0,
    p_amount: movement.amount,
    p_description: movement.description,
    p_done_at: movement.done_at,
    p_type: movement.type,
    p_from: movement.from,
    ...(movement.type === "transfer"
      ? { p_where: movement.where }
      : { p_category: movement.category }),
  });

  if (error) {
    throw error;
  }
};

export const deleteMovement = async (id: number) => {
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_movement_with_balance", {
    p_movement_id: id,
  });

  if (error) {
    throw error;
  }
};

export const updateMovement = async (
  movement: z.infer<typeof MovementSchema>,
  id: number,
) => {
  const supabase = await createClient();
  const { error } = await supabase.rpc("save_movement_with_balance", {
    p_movement_id: id,
    p_amount: movement.amount,
    p_description: movement.description,
    p_done_at: movement.done_at,
    p_type: movement.type,
    p_from: movement.from,
    ...(movement.type === "transfer" ? {} : { p_category: movement.category }),
  });

  if (error) {
    throw error;
  }
};

export const getExpenses = async (
  accountId: string,
  year?: number,
  month?: number,
): Promise<MovementApi[]> => {
  const supabase = await createClient();
  const { initialDate, finishDate } = getInitialAndFinalDate(year, month);

  let query = supabase
    .from("movement")
    .select(
      `id, from, amount, description, category, type, done_at, balance_after, fullCategory:effective_categories(id, is_global, is_custom_name, title, icon, color)`,
    )
    .eq("type", "expense")
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  if (accountId !== "all") {
    query = query.eq("from", Number.parseInt(accountId));
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
