import { getBalanceByMonthYear } from "@/services/database";
import { YearMonth } from "@/types/general";
import { createClient } from "@/utils/supabase-server";
import { SupabaseClient } from "@supabase/supabase-js";
import { Card } from "@tremor/react";

export default async function Balance({ year, month }: Readonly<YearMonth>) {
  const supabase = createClient();

  const {
    current_total: currentTotal,
    total_expenses,
    total_incomes,
  } = await getBalanceByMonthYear(supabase, month, year);

  const getPreviousMonth = async (
    supabase: SupabaseClient,
    month: number,
    year: number,
  ) => {
    if (month === 0) {
      return await getBalanceByMonthYear(supabase, 11, year - 1);
    } else {
      return await getBalanceByMonthYear(supabase, month - 1, year);
    }
  };

  const { current_total: currentTotalLm } = await getPreviousMonth(
    supabase,
    month,
    year,
  );

  return (
    <Card className="mb-4 px-3 py-2">
      <div className="grid grid-cols-3 text-center">
        <div>
          <p className="font-semibold">Balance</p>
          <p className={currentTotal < 0 ? "text-red-600" : ""}>
            {currentTotal.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="font-semibold">This month</p>
          <p
            className={total_incomes - total_expenses < 0 ? "text-red-600" : ""}
          >
            {(total_incomes - total_expenses).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="font-semibold">Last month</p>
          <p className={currentTotalLm < 0 ? "text-red-600" : ""}>
            {currentTotalLm.toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
}
