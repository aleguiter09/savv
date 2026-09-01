"use client";

import { Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ConfirmDialog } from "@/modules/shared/ui/common/ConfirmDialog";
import { showToast } from "@/modules/shared/ui/toast";
import type { ServerActionResponse } from "@/modules/shared/types/global.types";
import { Button } from "@/ui/button";

export type DeleteNamespace = "accounts" | "categories" | "budgets" | "movements";

const DEFAULT_ERROR_KEYS: Record<DeleteNamespace, string> = {
  accounts: "defaultError",
  categories: "databaseError",
  budgets: "defaultError",
  movements: "defaultError",
};

type ConfirmDeleteButtonProps = {
  namespace: DeleteNamespace;
  descriptionValues: Record<string, string | number>;
  descriptionKey?: string;
  onConfirm: () => Promise<ServerActionResponse | void>;
  successMessageKey?: string;
  defaultErrorKey?: string;
  onSuccess?: () => void;
  trigger?: ReactNode;
};

export function ConfirmDeleteButton({
  namespace,
  descriptionValues,
  descriptionKey = "deleteDialog",
  onConfirm,
  successMessageKey = "deletedSuccess",
  defaultErrorKey,
  onSuccess,
  trigger,
}: ConfirmDeleteButtonProps) {
  const tCommon = useTranslations("common");
  const t = useTranslations(namespace);

  const handleConfirm = async () => {
    const result = await onConfirm();

    if (!result) {
      return;
    }

    if (result.success) {
      showToast({ type: "success", message: t(successMessageKey) });
      onSuccess?.();
      return;
    }

    const errorKey = result.error ?? defaultErrorKey ?? DEFAULT_ERROR_KEYS[namespace];
    showToast({ type: "error", message: t(errorKey) });
  };

  return (
    <ConfirmDialog
      trigger={
        trigger ?? (
          <Button size="icon" className="p-0" variant="secondary">
            <Trash2 className="cursor-pointer" size={16} />
          </Button>
        )
      }
      title={tCommon("areYouSure")}
      description={t(descriptionKey, descriptionValues)}
      confirmLabel={tCommon("confirm")}
      cancelLabel={tCommon("cancel")}
      onConfirm={handleConfirm}
    />
  );
}
