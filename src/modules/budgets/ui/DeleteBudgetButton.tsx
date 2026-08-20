"use client";

import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/modules/shared/ui/common/ConfirmDialog";
import { deleteBudgetForm } from "@/modules/budgets/actions/budget-actions";
import { useToastStore } from "@/modules/shared/ui/toast-store";
import { Button } from "@/ui/button";

export function DeleteBudgetButton({
  id,
  categoryLabel,
}: {
  id: number;
  categoryLabel: string;
}) {
  const t = useTranslations("budgets");
  const show = useToastStore((store) => store.show);

  const handleDelete = async () => {
    const res = await deleteBudgetForm(id);

    if (res.success) {
      show({ type: "success", message: t("deletedSuccess") });
    } else {
      show({ type: "error", message: t(res.error ?? "defaultError") });
    }
  };

  const trigger = (
    <Button size="icon" className="p-0" variant="secondary">
      <Trash2 className="cursor-pointer" size={16} />
    </Button>
  );

  return (
    <ConfirmDialog
      trigger={trigger}
      title={t("areYouSure")}
      description={
        <>
          {t("dialogBudget")} {categoryLabel}. <br />
          {t("dialogWarning")}
        </>
      }
      confirmLabel={t("confirm")}
      cancelLabel={t("cancel")}
      onConfirm={handleDelete}
    />
  );
}
