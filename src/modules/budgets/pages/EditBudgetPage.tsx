import { getCategories } from "@/modules/categories/services/categories";
import { adaptCategory } from "@/modules/categories/adapters/categories.adapter";
import { deleteBudgetForm } from "@/modules/budgets/actions/budget-actions";
import { getBudgetById } from "@/modules/budgets/services/budgets";
import { BudgetForm } from "@/modules/budgets/ui/BudgetForm";
import { ConfirmDelete } from "@/modules/shared/ui/common/ConfirmDelete";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

type EditBudgetPageProps = {
  id: number;
};

const INCOME_PARENT_ID = 60;

export async function EditBudgetPage({ id }: Readonly<EditBudgetPageProps>) {
  const [t, categoriesT, budget, categories] = await Promise.all([
    getTranslations("budgets"),
    getTranslations("categories"),
    getBudgetById(id),
    getCategories(),
  ]);

  if (!budget) {
    notFound();
  }

  const expenseCategories = categories
    .filter(
      (category) =>
        category.parent_id !== null &&
        category.parent_id !== INCOME_PARENT_ID &&
        !category.is_hidden,
    )
    .map(adaptCategory);

  const categoryLabel =
    budget.isGlobal && !budget.isCustomName
      ? categoriesT(budget.categoryTitle)
      : budget.categoryTitle;

  const handleDelete = async () => {
    "use server";
    await deleteBudgetForm(Number(budget.id));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/settings/budgets">
          <ArrowLeft />
        </Link>
        <h4 className="font-medium">{t("detailsTitle")}</h4>
        <ConfirmDelete deleteAction={handleDelete}>
          <span className="mt-2 text-gray-500">
            {t("dialogBudget")} {categoryLabel}. <br />
            {t("dialogWarning")}
          </span>
        </ConfirmDelete>
      </div>

      <BudgetForm budget={budget} categories={expenseCategories} />
    </>
  );
}
