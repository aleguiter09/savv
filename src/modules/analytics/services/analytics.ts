import { createClient } from "@/infra/supabase/server";
import { parseCashflowMonths } from "../adapters/analytics.adapter";
import {
  aggregateMonthlyCashflow,
  getMonthlyCashflowRange,
} from "../adapters/monthlyCashflowAdapter";
import type { CashflowMonthsOption } from "../types/analytics-filters.types";
import type { MonthlyCashflowRow } from "../types/monthly-cashflow.types";
import { accountFilterToRpc } from "../utils/accountFilterToRpc";

export interface BalanceTimelinePoint {
  bucket_date: string;
  balance: number;
}

export async function getBalanceTimeline({
  from,
  to,
  bucket,
  account_filter,
}: {
  from: string;
  to: string;
  bucket: "day" | "week" | "month";
  account_filter?: number;
}): Promise<BalanceTimelinePoint[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_balance_timeline", {
    from_date: from,
    to_date: to,
    bucket,
    account_filter: account_filter,
  });

  if (error) {
    console.error("Error cargando timeline de balance:", error);
    throw error;
  }

  if (!data) return [];

  return data.map((item) => ({
    bucket_date: item.bucket_date,
    balance: Number(item.balance || 0),
  }));
}

export async function getCategoryComparison(accountId?: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_category_comparison", {
    p_account_id: accountId ? accountFilterToRpc(accountId) : undefined,
  });

  if (error) {
    console.error(error);
    throw new Error("Error fetching category comparison");
  }

  return data;
}

export async function getMonthlyCashflow(
  accountId = "all",
  months: CashflowMonthsOption | number = 12,
): Promise<MonthlyCashflowRow[]> {
  const validatedMonths = parseCashflowMonths(String(months));
  const supabase = await createClient();
  const { from, to } = getMonthlyCashflowRange(validatedMonths);
  const accountFilter = accountFilterToRpc(accountId);

  let query = supabase
    .from("movement")
    .select("amount, type, done_at")
    .eq("applied", true)
    .in("type", ["income", "expense"])
    .gte("done_at", from)
    .lte("done_at", to);

  if (accountFilter !== undefined) {
    query = query.eq("from", accountFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching monthly cashflow:", error);
    throw new Error("Error fetching monthly cashflow");
  }

  return aggregateMonthlyCashflow(data ?? [], validatedMonths);
}
