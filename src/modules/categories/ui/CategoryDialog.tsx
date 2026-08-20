"use client";

import { type ReactNode } from "react";
import { FormDialog } from "@/modules/shared/ui/common/FormDialog";
import { useTranslations } from "next-intl";
import { CategoryForm, type CategoryFormProps } from "./CategoryForm";

type CategoryDialogProps = CategoryFormProps & {
  trigger: ReactNode;
};

export function CategoryDialog({
  trigger,
  ...categoryProps
}: Readonly<CategoryDialogProps>) {
  const t = useTranslations("categories");
  const title = categoryProps.id ? t("editTitle") : t("addTitle");

  return (
    <FormDialog trigger={trigger} title={title}>
      {({ onSuccess }) => (
        <CategoryForm {...categoryProps} onSuccess={onSuccess} />
      )}
    </FormDialog>
  );
}
