import { getExpenses } from "@/modules/movements/services/movements";
import { parseMovementsForChart } from "@/modules/shared/utils/common";
import Link from "next/link";
import { Card } from "@/ui/card";
import { adaptMovementItem } from "@/modules/movements/adapters/movements.adapter";
import { getLocale, getTranslations } from "next-intl/server";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";

type Props = Readonly<{
  accountId: string;
  year?: number;
  month?: number;
}>;

export async function ExpensesDataChart({ accountId, year, month }: Props) {
  const [movements, locale, t] = await Promise.all([
    getExpenses(accountId, year, month),
    getLocale(),
    getTranslations("dashboard"),
  ]);
  const adaptedMovements = movements.map(adaptMovementItem);

  const data = parseMovementsForChart(adaptedMovements);
  const total = data.reduce((acc, item) => acc + item.amount, 0);

  return (
    <Card className="mb-4 pl-4 pr-3 py-2">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pb-1">
        {data.map((item) => (
          <Link
            href={`/movements?account=${accountId}&category=${item.category}`}
            key={item.title}
            className={`text-sm px-1.5 rounded-md py-2 border border-${item?.color}-500 border-s-4 bg-white`}
          >
            <div className="flex gap-1.5">
              <div className="w-full">
                <div className="flex justify-between space-x-1">
                  <p className="text-right text-slate-500 ">{item.title}</p>
                  <p className="font-medium text-right whitespace-nowrap">
                    {formatCurrency(locale, item.amount, 0)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
        <div className="flex mt-2 ml-auto col-span-2 md:col-span-3">
          <p className="text-sm">
            {t("totalExpenses")}: {formatCurrency(locale, total, 0)}
          </p>
        </div>
        {data.length === 0 && (
          <p className="pt-2 text-sm text-slate-500 text-center col-span-3">
            {t("noExpensesThisMonth")}
          </p>
        )}
      </div>
    </Card>
  );
}

export function ExpensesDataSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pb-1">
      <div
        className={`h-8 rounded-md px-1.5 py-2 bg-slate-300 animate-pulse`}
      />
      <div
        className={`h-8 rounded-md px-1.5 py-2 bg-slate-300 animate-pulse`}
      />
      <div
        className={`h-8 rounded-md px-1.5 py-2 bg-slate-300 animate-pulse`}
      />
      <div
        className={`h-8 rounded-md px-1.5 py-2 bg-slate-300 animate-pulse`}
      />
      <div
        className={`h-8 rounded-md px-1.5 py-2 bg-slate-300 animate-pulse`}
      />
      <div
        className={`h-8 rounded-md px-1.5 py-2 bg-slate-300 animate-pulse`}
      />
    </div>
  );
}
