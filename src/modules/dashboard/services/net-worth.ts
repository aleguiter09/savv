import { createClient } from "@/infra/supabase/server";
import { getAccounts } from "@/modules/accounts/services/accounts";
import type { AnalyticsFiltersParams } from "@/modules/analytics/types/analytics-filters.types";

type NetWorthResult = {
  current: number;
  periodStart: number;
};

type AccountBalanceRow = {
  from: number;
  balance: number;
};

function filterAccountsById(
  accounts: Awaited<ReturnType<typeof getAccounts>>,
  accountId: string,
) {
  if (!accounts) return [];
  if (accountId === "all") return accounts;
  return accounts.filter((acc) => acc.id?.toString() === accountId);
}

function sumBalancesAtDate(
  accounts: NonNullable<Awaited<ReturnType<typeof getAccounts>>>,
  balanceRows: AccountBalanceRow[] | null,
) {
  if (!balanceRows) {
    return accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);
  }

  const balanceMap = new Map(balanceRows.map((row) => [row.from, Number(row.balance)]));

  return accounts.reduce((sum, acc) => {
    const historicalBalance = balanceMap.get(acc.id);
    return sum + (historicalBalance ?? Number(acc.balance || 0));
  }, 0);
}

export async function getNetWorth({
  from,
  to,
  accountId = "all",
}: AnalyticsFiltersParams): Promise<NetWorthResult> {
  const supabase = await createClient();
  const accounts = await getAccounts();
  const relevantAccounts = filterAccountsById(accounts, accountId);

  if (relevantAccounts.length === 0) {
    return { current: 0, periodStart: 0 };
  }

  const [startResult, endResult] = await Promise.all([
    supabase.rpc("get_accounts_balance_at", { target_date: from.toISOString() }),
    supabase.rpc("get_accounts_balance_at", { target_date: to.toISOString() }),
  ]);

  if (startResult.error) {
    console.error("Error obteniendo balance al inicio del periodo:", startResult.error);
  }

  if (endResult.error) {
    console.error("Error obteniendo balance al final del periodo:", endResult.error);
  }

  return {
    periodStart: sumBalancesAtDate(relevantAccounts, startResult.data),
    current: sumBalancesAtDate(relevantAccounts, endResult.data),
  };
}
