import { getCategories } from "@/modules/categories/services/categories";
import { adaptCategory } from "@/modules/categories/adapters/categories.adapter";
import { getBudgets } from "@/modules/budgets/services/budgets";
import { BudgetForm } from "@/modules/budgets/ui/BudgetForm";
import { ToastManager } from "@/modules/shared/ui/Toast/toast-manager";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const INCOME_PARENT_ID = 60;

export async function CreateBudgetPage() {
  const [t, categories, budgets] = await Promise.all([
    getTranslations("budgets"),
    getCategories(),
    getBudgets(),
  ]);

  const budgetedCategoryIds = new Set(
    budgets.map((budget) => Number(budget.categoryId)),
  );

  const availableCategories = categories
    .filter(
      (category) =>
        category.parent_id !== null &&
        category.parent_id !== INCOME_PARENT_ID &&
        !category.is_hidden,
    )
    .filter((category) => !budgetedCategoryIds.has(category.id!))
    .map(adaptCategory);

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/settings/budgets">
          <ArrowLeft />
        </Link>
        <h4 className="font-medium">{t("addTitle")}</h4>
        <span />
      </div>

      {availableCategories.length === 0 ? (
        <p className="text-sm text-slate-500">{t("noCategoriesAvailable")}</p>
      ) : (
        <BudgetForm categories={availableCategories} />
      )}

      <ToastManager />
    </>
  );
}
