import { getExpenses } from "@/services/movements";
import { parseMovementsForChart } from "@/utils/common";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function ExpenseByCatChart({
  account,
  year,
  month,
}: Readonly<{ account: number; year?: number; month?: number }>) {
  const [movements, t] = await Promise.all([
    getExpenses(account, year, month),
    getTranslations(),
  ]);
  const data = parseMovementsForChart(movements);

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
                <p className="text-right text-slate-500 ">
                  {t(`categories.${item.title}`)}
                </p>
                <p className="font-medium text-right whitespace-nowrap">
                  ${item.amount.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
      {data.length === 0 && (
        <p className="pt-2 text-sm text-slate-500 text-center col-span-3">
          {t("home.noExpensesThisMonth")}
        </p>
      )}
    </div>
  );
}
