import { adaptMovementItem } from "@/modules/movements/adapters/movements.adapter";
import { getExpenses } from "@/modules/movements/services/movements";
import { parseMovementsForChart } from "@/modules/shared/utils/common";
import { getCategoryBorderClass } from "@/modules/shared/utils/constants";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { Card } from "@/ui/card";

type ChartProps = Readonly<{
  accountId: string;
  year?: number;
  month?: number;
}>;

type CategoriesTranslator = Awaited<
  ReturnType<typeof getTranslations<"categories">>
>;
type DashboardTranslator = Awaited<
  ReturnType<typeof getTranslations<"dashboard">>
>;

async function getExpensesChartData(
  accountId: string,
  year?: number,
  month?: number,
) {
  const movements = await getExpenses(accountId, year, month);
  return parseMovementsForChart(movements.map(adaptMovementItem));
}

function ExpensesCategoryGrid({
  data,
  accountId,
  locale,
  tCategories,
  tDashboard,
}: Readonly<{
  data: ReturnType<typeof parseMovementsForChart>;
  accountId: string;
  locale: string;
  tCategories: CategoriesTranslator;
  tDashboard: DashboardTranslator;
}>) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pb-1">
      {data.map((item) => (
        <Link
          href={`/movements?account=${accountId}&category=${item.category}`}
          key={item.title}
          className={`text-sm px-1.5 rounded-md py-2 border ${getCategoryBorderClass(item.color)} border-s-4 bg-white`}
        >
          <div className="flex gap-1.5">
            <div className="w-full">
              <div className="flex justify-between px-[0.15rem]">
                <p className="text-right text-slate-500">
                  {tCategories(item.title)}
                </p>
                <p className="font-medium text-right whitespace-nowrap">
                  {formatCurrency(locale, item.amount, 0)}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
      {data.length === 0 && (
        <p className="pt-2 text-sm text-slate-500 text-center col-span-3">
          {tDashboard("noExpensesThisMonth")}
        </p>
      )}
    </div>
  );
}

export async function ExpenseByCatChart({ accountId, year, month }: ChartProps) {
  const [data, tCategories, tDashboard, locale] = await Promise.all([
    getExpensesChartData(accountId, year, month),
    getTranslations("categories"),
    getTranslations("dashboard"),
    getLocale(),
  ]);

  return (
    <ExpensesCategoryGrid
      data={data}
      accountId={accountId}
      locale={locale}
      tCategories={tCategories}
      tDashboard={tDashboard}
    />
  );
}

export async function ExpensesDataChart({ accountId, year, month }: ChartProps) {
  const [data, locale, tCategories, tDashboard] = await Promise.all([
    getExpensesChartData(accountId, year, month),
    getLocale(),
    getTranslations("categories"),
    getTranslations("dashboard"),
  ]);
  const total = data.reduce((acc, item) => acc + item.amount, 0);

  return (
    <Card className="mb-4 pl-4 pr-3 py-2">
      <ExpensesCategoryGrid
        data={data}
        accountId={accountId}
        locale={locale}
        tCategories={tCategories}
        tDashboard={tDashboard}
      />
      {data.length > 0 && (
        <div className="flex mt-2 ml-auto col-span-2 md:col-span-3">
          <p className="text-sm">
            {tDashboard("totalExpenses")}: {formatCurrency(locale, total, 0)}
          </p>
        </div>
      )}
    </Card>
  );
}

export function ExpensesByCategorySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pb-1">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-8 rounded-md px-1.5 py-2 bg-slate-300 animate-pulse"
        />
      ))}
    </div>
  );
}

export const ExpenseByCatSkeleton = ExpensesByCategorySkeleton;
export const ExpensesDataSkeleton = ExpensesByCategorySkeleton;
