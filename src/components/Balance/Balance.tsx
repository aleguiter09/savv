import { getBalanceByMonthYear } from "@/services/database";
import { YearMonth } from "@/types/general";
import { createClient } from "@/utils/supabase-server";
import { SupabaseClient } from "@supabase/supabase-js";
import { Card } from "@tremor/react";
import { mdiSquareEditOutline } from "@mdi/js";
import Icon from "@mdi/react";

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
    year: number
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
    year
  );

  const thisMonth = total_incomes - total_expenses;

  return (
    <Card className="mb-4 px-3 py-2">
      <div className="grid grid-cols-3 text-center">
        <div>
          <div className="flex gap-2 items-center justify-center">
            <p className="font-semibold">Balance</p>
            <Icon path={mdiSquareEditOutline} size="15px" />
          </div>
          <p className={currentTotal < 0 ? "text-red-600" : ""}>
            {currentTotal.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="font-semibold">This month</p>
          <p className={thisMonth < 0 ? "text-red-600" : ""}>
            {thisMonth.toFixed(2)}
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
