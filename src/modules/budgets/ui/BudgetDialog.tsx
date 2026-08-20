"use client";

import { type ReactNode } from "react";
import { FormDialog } from "@/modules/shared/ui/common/FormDialog";
import { useTranslations } from "next-intl";
import { useData } from "@/modules/shared/stores/DataProvider";
import { BudgetForm } from "./BudgetForm";
import { getAvailableBudgetCategories } from "../utils/getAvailableBudgetCategories";
import type { BudgetView } from "../types/types";

type BudgetDialogProps = {
  trigger: ReactNode;
  budget?: BudgetView;
  budgets: BudgetView[];
};

export function BudgetDialog({
  trigger,
  budget,
  budgets,
}: Readonly<BudgetDialogProps>) {
  const t = useTranslations("budgets");
  const { expenseCategories } = useData();
  const title = budget ? t("editTitle") : t("addTitle");

  const availableCategories = getAvailableBudgetCategories(
    expenseCategories,
    budgets,
    budget,
  );

  return (
    <FormDialog trigger={trigger} title={title}>
      {({ onSuccess }) =>
        availableCategories.length === 0 && !budget ? (
          <p className="text-sm text-slate-500">{t("noCategoriesAvailable")}</p>
        ) : (
          <BudgetForm
            budget={budget}
            categories={
              budget
                ? expenseCategories.filter((category) => !category.isHidden)
                : availableCategories
            }
            onSuccess={onSuccess}
          />
        )
      }
    </FormDialog>
  );
}
