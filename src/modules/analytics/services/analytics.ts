import { createClient } from "@/infra/supabase/server";
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
