import { getInitialAndFinalDate } from "@/modules/shared/utils/common";
import { createClient } from "@/infra/supabase/server";

export const getMonthIncomes = async (accountId: string) => {
  const supabase = await createClient();
  const { initialDate, finishDate } = getInitialAndFinalDate();
  let query = supabase
    .from("movement")
    .select("amount")
    .eq("type", "income")
    .eq("applied", true)
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
    .eq("applied", true)
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  if (accountId !== "all") {
    query = query.eq("from", Number.parseInt(accountId));
  }

  const { data } = await query;
  return Math.abs(data?.reduce((a, b) => a + b.amount, 0) ?? 0);
};
