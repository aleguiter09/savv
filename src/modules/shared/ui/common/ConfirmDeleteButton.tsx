"use client";

import { Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { ConfirmDialog } from "@/modules/shared/ui/common/ConfirmDialog";
import { showToast } from "@/modules/shared/ui/toast";
import type { ServerActionResponse } from "@/modules/shared/types/global.types";
import { Button } from "@/ui/button";

type ConfirmDeleteButtonProps = {
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => Promise<ServerActionResponse | void>;
  successMessage?: string;
  resolveErrorMessage?: (errorKey?: string) => string;
  onSuccess?: () => void;
  trigger?: ReactNode;
};

export function ConfirmDeleteButton({
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  successMessage,
  resolveErrorMessage,
  onSuccess,
  trigger,
}: ConfirmDeleteButtonProps) {
  const handleConfirm = async () => {
    const result = await onConfirm();

    if (!result) {
      return;
    }

    if (result.success) {
      if (successMessage) {
        showToast({ type: "success", message: successMessage });
      }
      onSuccess?.();
      return;
    }

    if (resolveErrorMessage) {
      showToast({
        type: "error",
        message: resolveErrorMessage(result.error),
      });
    }
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
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      onConfirm={handleConfirm}
    />
  );
}
