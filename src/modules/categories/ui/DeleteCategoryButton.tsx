"use client";

import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/modules/shared/ui/common/ConfirmDialog";
import { deleteCategoryForm } from "../actions/category-action";
import { Button } from "@/ui/button";

const BrComponent = () => <br />;

export function DeleteCategoryButton({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  const t = useTranslations("categories");

  const handleDelete = async () => {
    await deleteCategoryForm(id);
  };

  const trigger = (
    <Button size="icon" className="p-0" variant="secondary">
      <Trash2 className="cursor-pointer" size="16" />
    </Button>
  );

  return (
    <ConfirmDialog
      trigger={trigger}
      title={t("areYouSure")}
      description={t.rich("deleteDialog", {
        title,
        br: BrComponent,
      })}
      confirmLabel={t("confirm")}
      cancelLabel={t("cancel")}
      onConfirm={handleDelete}
    />
  );
}
