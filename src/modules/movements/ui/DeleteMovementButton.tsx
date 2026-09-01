"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { deleteMovementForm } from "../actions/movement-action";
import { ConfirmDeleteButton } from "@/modules/shared/ui/common/ConfirmDeleteButton";
import type { MovementView } from "../types/types";

const BrComponent = () => <br />;

export function DeleteMovementButton({ movement }: { movement: MovementView }) {
  const t = useTranslations("movements");
  const router = useRouter();

  return (
    <ConfirmDeleteButton
      trigger={<Trash2 className="cursor-pointer" />}
      title={t("areYouSure")}
      description={t.rich("deleteDialog", {
        description: movement.description,
        br: BrComponent,
      })}
      confirmLabel={t("confirm")}
      cancelLabel={t("cancel")}
      onConfirm={() => deleteMovementForm(movement.id)}
      successMessage={t("deletedSuccess")}
      resolveErrorMessage={(error) => t(error ?? "defaultError")}
      onSuccess={() => router.push("/home")}
    />
  );
}
