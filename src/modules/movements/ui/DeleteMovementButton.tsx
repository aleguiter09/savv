"use client";

import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { deleteMovementForm } from "../actions/movement-action";
import type { Movement } from "@/modules/shared/types/global.types";
import { ConfirmDialog } from "@/modules/shared/ui/common/ConfirmDialog";

export function DeleteMovementButton({ movement }: { movement: Movement }) {
  const t = useTranslations("movements");

  const handleDelete = async () => {
    await deleteMovementForm(movement);
  };

  return (
    <ConfirmDialog
      trigger={<Trash2 className="cursor-pointer" />}
      title={t("areYouSure")}
      description={
        <>
          {t("dialogMovement")} {movement.comment}. <br />
          {t("dialogWarning")}
        </>
      }
      confirmLabel={t("confirm")}
      cancelLabel={t("cancel")}
      onConfirm={handleDelete}
    />
  );
}
