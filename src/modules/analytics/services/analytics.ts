import { createClient } from "@/infra/supabase/server";

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
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_balance_timeline", {
    from_date: from,
    to_date: to,
    bucket,
    account_filter: account_filter,
  });

  if (error) throw error;

  return data;
}

function getBucket(range: "7d" | "30d" | "3m" | "1y") {
  if (range === "7d" || range === "30d") return "day";
  if (range === "3m") return "week";
  if (range === "1y") return "month";
}

export async function getCategoryComparison(accountId?: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_category_comparison", {
    p_account_id: accountId ? Number.parseInt(accountId) : undefined,
  });

  if (error) {
    console.error(error);
    throw new Error("Error fetching category comparison");
  }

  return data;
}
