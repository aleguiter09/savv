import { getExpenses } from "@/services/movements";
import { parseMovementsForChart } from "@/utils/common";
import { createClient } from "@/utils/supabase-server";
import Link from "next/link";

export default async function ExpensesDataChart({
  account,
  year,
  month,
}: Readonly<{ account: number; year?: number; month?: number }>) {
  const supabase = await createClient();
  const movements = await getExpenses(supabase, account, year, month);
  const data = parseMovementsForChart(movements);
  const total = data.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pb-1">
      {data.map((item) => (
        <Link
          href={`/movements?account=${account}&category=${item.category}`}
          key={item.title}
          className={`text-sm px-1.5 rounded-md py-2 border border-${item?.color} border-s-4 bg-white`}
        >
          <div className="flex gap-1.5">
            <div className="w-full">
              <div className="flex justify-between space-x-1">
                <p className="text-right text-slate-500 ">{item.title}</p>
                <p className="font-medium text-right whitespace-nowrap">
                  ${item.amount.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
      <div className="flex mt-2 ml-auto col-span-2 md:col-span-3">
        <p className="text-sm">Total expenses: ${total.toFixed(0)}</p>
      </div>
      {data.length === 0 && (
        <p className="pt-2 text-sm text-slate-500 text-center col-span-3">
          No expenses this month
        </p>
      )}
    </div>
  );
}