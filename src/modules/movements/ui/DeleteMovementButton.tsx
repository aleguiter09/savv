"use client";

import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { deleteMovementForm } from "../actions/movement-action";
import type { Movement } from "@/modules/shared/types/global.types";
import { ConfirmDialog } from "@/modules/shared/ui/common/ConfirmDialog";

const BrComponent = () => <br />;

export function DeleteMovementButton({ movement }: { movement: Movement }) {
  const t = useTranslations("movements");

  const handleDelete = async () => {
    await deleteMovementForm(movement);
  };

  return (
    <ConfirmDialog
      trigger={<Trash2 className="cursor-pointer" />}
      title={t("areYouSure")}
      description={t.rich("deleteDialog", {
        comment: movement.comment,
        br: BrComponent,
      })}
      confirmLabel={t("confirm")}
      cancelLabel={t("cancel")}
      onConfirm={handleDelete}
    />
  );
}
