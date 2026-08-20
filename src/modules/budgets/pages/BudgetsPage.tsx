import { getBudgets } from "@/modules/budgets/services/budgets";
import { BudgetDialog } from "@/modules/budgets/ui/BudgetDialog";
import { BudgetsList } from "@/modules/budgets/ui/BudgetsList";
import { FloatingAddButton } from "@/modules/dashboard/ui/ActionBar/FloatingAddButton";
import { getLocale, getTranslations } from "next-intl/server";

export async function BudgetsPage() {
  const [settingsT, locale, budgets] = await Promise.all([
    getTranslations("settings"),
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
        <BudgetDialog budgets={budgets} trigger={<FloatingAddButton />} />
      </div>

      <BudgetsList budgets={budgets} locale={locale} />
    </>
  );
}
