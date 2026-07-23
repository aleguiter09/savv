import { createClient } from "@/infra/supabase/server";
import { getAccounts } from "@/modules/accounts/services/accounts";

export const getNetWorth = async () => {
  const supabase = await createClient();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const accounts = await getAccounts();

  if (!accounts || accounts.length === 0) {
    return { current: 0, pastMonth: 0 };
  }

  const { data, error } = await supabase.rpc("get_accounts_balance_at", {
    target_date: thirtyDaysAgo.toISOString(),
  });

  if (error) {
    console.error("Error obteniendo balance histórico:", error);
  }

  const current = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance || 0),
    0,
  );

  if (!data) return { current, pastMonth: current };

  const pastMap = new Map(data.map((d) => [d.from, Number(d.balance)]));

  const pastMonth = accounts.reduce((sum, acc) => {
    const historicalBalance = pastMap.get(acc.id);
    return sum + (historicalBalance ?? Number(acc.balance || 0));
  }, 0);

  return { current, pastMonth };
};
