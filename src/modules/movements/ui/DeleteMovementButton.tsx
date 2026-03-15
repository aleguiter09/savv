"use client";

import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { deleteMovementForm } from "../actions/movement-action";
import { ConfirmDialog } from "@/modules/shared/ui/common/ConfirmDialog";
import type { MovementView } from "../types/types";

const BrComponent = () => <br />;

export function DeleteMovementButton({ movement }: { movement: MovementView }) {
  const t = useTranslations("movements");

  const handleDelete = async () => {
    await deleteMovementForm(movement);
  };

  return (
    <ConfirmDialog
      trigger={<Trash2 className="cursor-pointer" />}
      title={t("areYouSure")}
      description={t.rich("deleteDialog", {
        description: movement.description,
        br: BrComponent,
      })}
      confirmLabel={t("confirm")}
      cancelLabel={t("cancel")}
      onConfirm={handleDelete}
    />
  );
}
