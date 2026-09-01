import { type MovementApi } from "../types/types";
import { mapMovementApiRow, mapMovementApiRows } from "../adapters/movements.adapter";
import { getInitialAndFinalDate } from "@/modules/shared/utils/common";
import { createClient } from "@/infra/supabase/server";
import { mergeTransferLegs } from "./transfer.utils";
import { MOVEMENT_SELECT } from "./movements.constants";

export const getMovementsByFilters = async (
  from: Date,
  to: Date,
  accountId: string,
  categoryId: string,
  page = 1,
  pageSize = 30,
): Promise<{ data: MovementApi[]; total: number }> => {
  const supabase = await createClient();
  const fromIndex = (page - 1) * pageSize;
  const toIndex = fromIndex + pageSize - 1;

  let query = supabase
    .from("movement")
    .select(MOVEMENT_SELECT, { count: "exact" })
    .eq("applied", true)
    .gte("done_at", from.toISOString())
    .lte("done_at", to.toISOString())
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

  const { data, count } = await query.range(fromIndex, toIndex);

  return {
    data: mapMovementApiRows(data),
    total: count ?? 0,
  };
};

export const getLastMovements = async (
  accountId: string,
): Promise<MovementApi[]> => {
  const supabase = await createClient();

  let query = supabase
    .from("movement")
    .select(MOVEMENT_SELECT)
    .eq("applied", true)
    .order("done_at", { ascending: false })
    .limit(5);

  if (accountId !== "all") {
    query = query.eq("from", Number(accountId));
  }

  const { data } = await query;

  return mapMovementApiRows(data);
};

export const getUpcomingMovements = async (
  accountId: string,
): Promise<MovementApi[]> => {
  const supabase = await createClient();

  let query = supabase
    .from("movement")
    .select(MOVEMENT_SELECT)
    .eq("applied", false)
    .order("done_at", { ascending: true })
    .limit(5);

  if (accountId !== "all") {
    query = query.eq("from", Number(accountId));
  }

  const { data } = await query;

  return mapMovementApiRows(data);
};

export const getMovementById = async (
  id: number,
): Promise<MovementApi | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("movement")
    .select(
      `id, from, amount, description, category, type, done_at, balance_after, applied, series_id, installment_index, transfer_group_id, fullCategory:effective_categories(id, is_global, is_custom_name, title, icon, color), fullAccount:from(id, name, balance)`,
    )
    .eq("id", id)
    .single();

  if (!data) {
    return null;
  }

  const base = mapMovementApiRow(data);

  if (base.type !== "transfer" || !base.transfer_group_id) {
    return base;
  }

  const { data: legs } = await supabase
    .from("movement")
    .select(
      `id, from, amount, description, category, type, done_at, balance_after, applied, series_id, installment_index, transfer_group_id, fullAccount:from(id, name, balance)`,
    )
    .eq("transfer_group_id", base.transfer_group_id);

  if (!legs) {
    return base;
  }

  return mergeTransferLegs(base, legs);
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
    .select(MOVEMENT_SELECT)
    .eq("type", "expense")
    .eq("applied", true)
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  if (accountId !== "all") {
    query = query.eq("from", Number.parseInt(accountId));
  }

  const { data } = await query;

  return mapMovementApiRows(data);
};
