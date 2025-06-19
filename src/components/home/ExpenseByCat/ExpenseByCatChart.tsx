import { getExpenses } from "@/services/movements";
import { AccountIds } from "@/types/general";
import { parseMovementsForChart } from "@/utils/common";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Props = Readonly<{ accountId: AccountIds; year?: number; month?: number }>;

export async function ExpenseByCatChart({ accountId, year, month }: Props) {
  const [movements, t] = await Promise.all([
    getExpenses(accountId, year, month),
    getTranslations(),
  ]);
  const data = parseMovementsForChart(movements);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pb-1">
      {data.map((item) => (
        <Link
          href={`/movements?account=${accountId}&category=${item.category}`}
          key={item.title}
          className={`text-sm px-1.5 rounded-md py-2 border border-${item?.color} border-s-4 bg-white`}
        >
          <div className="flex gap-1.5">
            <div className="w-full">
              <div className="flex justify-between px-[0.15rem]">
                <p className="text-righgrid grid-cols-2 md:grid-cols-3 gap-2 pb-1t text-slate-500 ">
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

export function ExpenseByCatSkeleton() {
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
