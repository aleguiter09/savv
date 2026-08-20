"use client";

import { type ReactNode } from "react";
import { FormDialog } from "@/modules/shared/ui/common/FormDialog";
import { useTranslations } from "next-intl";
import { MovementForm } from "./CreateMovement/MovementForm";
import type { MovementView } from "../types/types";

type MovementDialogProps = {
  trigger: ReactNode;
  movement?: MovementView;
};

export function MovementDialog({
  trigger,
  movement,
}: Readonly<MovementDialogProps>) {
  const t = useTranslations("movements");
  const title = movement ? t("editTitle") : t("addTitle");

  return (
    <FormDialog trigger={trigger} title={title}>
      {({ onSuccess }) => (
        <MovementForm movement={movement} onSuccess={onSuccess} />
      )}
    </FormDialog>
  );
}
