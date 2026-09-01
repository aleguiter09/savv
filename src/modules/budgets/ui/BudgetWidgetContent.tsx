import { getBudgetProgress } from "@/modules/budgets/services/budgets";
import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { BudgetProgressBar } from "./BudgetProgressBar";
import { getCategoryLabel } from "@/modules/categories/utils/getCategoryLabel";

export async function BudgetWidgetContent() {
  const [items, t, locale] = await Promise.all([
    getBudgetProgress("all"),
    getTranslations(),
    getLocale(),
  ]);

  if (items.length === 0) {
    return (
      <p className="pt-2 text-sm text-slate-500 text-center">
        {t("dashboard.noBudgets")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 pb-1">
      {items.map((item) => {
        const categoryLabel = getCategoryLabel(
          item.categoryTitle,
          item.isGlobal,
          item.isCustomName,
          t,
        );

        return (
          <Link
            key={item.budgetId}
            href={`/movements?account=all&category=${item.categoryId}`}
            className={`rounded-sm border px-2 py-2 hover:bg-slate-50 ${
              item.isOverBudget ? "border-red-500" : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <CategoryIcon
                  icon={item.categoryIcon}
                  color={item.categoryColor}
                  size={14}
                />
                <p className="text-sm text-slate-700 truncate">
                  {categoryLabel}
                </p>
              </div>
              <p
                className={`text-sm font-medium whitespace-nowrap ${
                  item.isOverBudget ? "text-red-500" : "text-slate-700"
                }`}
              >
                {formatCurrency(locale, item.spentAmount, 0)}
                <span className="text-slate-400 font-normal">
                  {" / "}
                  {formatCurrency(locale, item.budgetAmount, 0)}
                </span>
              </p>
            </div>
            <BudgetProgressBar
              spent={item.spentAmount}
              budget={item.budgetAmount}
              color={item.categoryColor}
              isOverBudget={item.isOverBudget}
            />
          </Link>
        );
      })}
    </div>
  );
}

export function BudgetWidgetSkeleton() {
  return (
    <div className="flex flex-col gap-3 pb-1">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-16 rounded-md bg-slate-300 animate-pulse"
        />
      ))}
    </div>
  );
}
