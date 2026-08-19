import { getBudgets } from "@/modules/budgets/services/budgets";
import { AddButton } from "@/modules/dashboard/ui/ActionBar/AddButton";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

export async function BudgetsPage() {
  const [t, settingsT, categoriesT, locale, budgets] = await Promise.all([
    getTranslations("budgets"),
    getTranslations("settings"),
    getTranslations("categories"),
    getLocale(),
    getBudgets(),
  ]);

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-1 text-sm">
          <h3>{settingsT("title")}</h3>
          <span className="text-gray-500">/</span>
          <h3 className="font-semibold">{settingsT("budgets")}</h3>
        </div>
        <AddButton href="/settings/budgets/create" />
      </div>

      {budgets.length === 0 ? (
        <p className="text-sm text-slate-500">{t("emptyState")}</p>
      ) : (
        <ul className="text-sm flex flex-col gap-2">
          {budgets.map((budget) => {
            const categoryLabel =
              budget.isGlobal && !budget.isCustomName
                ? categoriesT(budget.categoryTitle)
                : budget.categoryTitle;

            return (
              <li key={budget.id}>
                <Link
                  href={`/settings/budgets/${budget.id}`}
                  tabIndex={0}
                  className="w-full px-4 py-2 border border-gray-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:text-blue-500 rounded-lg flex justify-between"
                >
                  <p>{categoryLabel}</p>
                  <p className="font-medium">
                    {formatCurrency(locale, budget.amount, 0)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
