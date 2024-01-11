import { getAccountBalanceById } from "@/services/accounts";
import { getMonthIncomes, getMonthExpenses } from "@/services/movements";
import { BalanceProps } from "@/types/components";
import { createClient } from "@/utils/supabase-server";
import { Card } from "@tremor/react";

export default async function Balance({ account }: Readonly<BalanceProps>) {
  const supabase = createClient();
  const [accountBalance, incomes, expenses] = await Promise.all([
    getAccountBalanceById(supabase, account),
    getMonthIncomes(supabase),
    getMonthExpenses(supabase),
  ]);

  return (
    <Card decoration="bottom" className="mb-4 px-3 py-2">
      <div className="grid grid-cols-3 text-center">
        <div>
          <div className="flex gap-2 items-center justify-center">
            <p className="font-semibold">Balance</p>
          </div>
          <p className={accountBalance < 0 ? "text-red-600" : ""}>
            {accountBalance.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="font-semibold">Incomes</p>
          <p className={accountBalance < 0 ? "text-red-600" : ""}>
            {incomes.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="font-semibold">Expenses</p>
          <p className={accountBalance < 0 ? "text-red-600" : ""}>
            {expenses.toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
}
