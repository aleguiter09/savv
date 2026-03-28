import { createClient } from "@/infra/supabase/server";
import { getAccounts } from "@/modules/accounts/services/accounts";

export const getNetWorth = async () => {
  const supabase = await createClient();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const targetDate = thirtyDaysAgo.toISOString();

  const accounts = await getAccounts();

  if (accounts.length === 0) return { current: 0, pastMonth: 0 };

  const { data } = await supabase.rpc("get_accounts_balance_at", {
    target_date: targetDate,
  });

  const current = accounts?.reduce((a, b) => a + b.balance, 0) ?? 0;

  if (!data) return { current, pastMonth: 0 };

  const pastMap = new Map(data.map((d) => [d.from, d.balance]));

  const pastMonth = accounts.reduce((sum, acc) => {
    return sum + (pastMap.get(acc.id) ?? 0);
  }, 0);

  return { current, pastMonth };
};
