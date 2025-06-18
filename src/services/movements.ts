import { getCategoryById } from "./categories";
import { Movement } from "@/types/database";
import { getInitialAndFinalDate } from "@/utils/common";
import { getAccountById } from "./accounts";
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
    .select("*")
    .gte("done_at", initialDate)
    .lte("done_at", finishDate)
    .order("done_at", { ascending: false });

  if (accountId !== "all") {
    query = query.eq("from", accountId);
  }

  if (!["all", "expenses", "incomes"].includes(categoryId as string)) {
    query = query.eq("category", categoryId);
  }

  if (categoryId === "expenses") {
    query = query.eq("type", "expense");
  } else if (categoryId === "incomes") {
    query = query.eq("type", "income");
  }

  const { data } = await query;

  if (data) {
    for (const d of data) {
      const mov = await getCategoryById(d.category);
      d.fullCategory = mov;
    }
    return data;
  }
  return [];
};

export const getLastMovements = async (accountId: AccountIds) => {
  const supabase = await createClient();

  let query = supabase
    .from("movement")
    .select()
    .order("done_at", { ascending: false })
    .limit(5);

  if (accountId !== "all") {
    query = query.eq("from", accountId);
  }

  const { data } = await query;

  if (data) {
    for (const m of data) {
      const mov = await getCategoryById(m.category);
      m.fullCategory = mov;
    }
    return data;
  }

  return [];
};

export const getMonthIncomes = async (accountId: number) => {
  const supabase = await createClient();
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

export const getMonthExpenses = async (accountId: number) => {
  const supabase = await createClient();
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

export const getMovementById = async (id: number): Promise<Movement> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("movement")
    .select()
    .eq("id", id)
    .single();

  if (data) {
    const category = await getCategoryById(data.category);
    const account = await getAccountById(data.from);
    data.fullCategory = category;
    data.fullAccount = account;
  }

  return data;
};

export const insertMovement = async (movement: Movement) => {
  const supabase = await createClient();
  return await supabase.from("movement").insert(movement);
};

export const deleteMovement = async (movementId: string) => {
  const supabase = await createClient();
  return await supabase.from("movement").delete().eq("id", movementId);
};

export const updateMovement = async (
  movement: Movement,
  movementId: string
) => {
  const supabase = await createClient();
  return await supabase.from("movement").update(movement).eq("id", movementId);
};

export const getExpenses = async (
  accountId: AccountIds,
  year?: number,
  month?: number
) => {
  const supabase = await createClient();
  const { initialDate, finishDate } = getInitialAndFinalDate(year, month);

  let query = supabase
    .from("movement")
    .select("amount, category")
    .eq("type", "expense")
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  if (accountId !== "all") {
    query = query.eq("from", accountId);
  }

  const { data } = await query;

  if (data) {
    const dataWithCategory = [];
    for (const d of data) {
      const mov = await getCategoryById(d.category);
      const movWithCategory = { ...d, fullCategory: mov };
      dataWithCategory.push(movWithCategory);
    }

    return dataWithCategory;
  }

  return [];
};
