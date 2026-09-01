"use client";

import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { getCategoryLabel } from "@/modules/categories/utils/getCategoryLabel";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";
import { Button } from "@/ui/button";
import { BudgetDialog } from "./BudgetDialog";
import { ConfirmDeleteButton } from "@/modules/shared/ui/common/ConfirmDeleteButton";
import { deleteBudgetForm } from "@/modules/budgets/actions/budget-actions";
import type { BudgetView } from "../types/types";

type BudgetsListProps = {
  budgets: BudgetView[];
  locale: string;
};

export function BudgetsList({ budgets, locale }: BudgetsListProps) {
  const t = useTranslations("categories");
  const budgetsT = useTranslations("budgets");

  return (
    <div className="flex flex-col gap-2">
      <ul className="text-sm flex flex-col gap-2">
        {budgets.map((budget) => {
          const categoryLabel = getCategoryLabel(
            budget.categoryTitle,
            budget.isGlobal,
            budget.isCustomName,
            t,
          );

          return (
            <li
              key={budget.id}
              className="w-full px-4 py-2 border border-gray-200 bg-white rounded-lg flex justify-between items-center"
            >
              <div className="flex justify-between flex-1 min-w-0 mr-2">
                <p className="truncate">{categoryLabel}</p>
                <p className="font-medium ml-2 shrink-0">
                  {formatCurrency(locale, budget.amount, 0)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <BudgetDialog
                  budget={budget}
                  budgets={budgets}
                  trigger={
                    <Button size="icon" variant="secondary">
                      <Pencil size={16} />
                    </Button>
                  }
                />
                <ConfirmDeleteButton
                  namespace="budgets"
                  descriptionValues={{ category: categoryLabel }}
                  onConfirm={() => deleteBudgetForm(Number(budget.id))}
                />
              </div>
            </li>
          );
        })}
        {budgets.length === 0 && (
          <p className="text-sm text-slate-500">{budgetsT("emptyState")}</p>
        )}
      </ul>

      <BudgetDialog
        budgets={budgets}
        trigger={
          <Button variant="outline" className="w-full">
            {budgetsT("addTitle")}
          </Button>
        }
      />
    </div>
  );
}
