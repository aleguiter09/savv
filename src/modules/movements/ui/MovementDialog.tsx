"use client";

import { type ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
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
  const [open, setOpen] = useState(false);
  const t = useTranslations("movements");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[95%]! max-h-[90dvh] overflow-y-auto rounded-lg sm:mx-auto sm:max-w-md!">
        <DialogHeader>
          <DialogTitle>{movement ? t("editTitle") : t("addTitle")}</DialogTitle>
        </DialogHeader>
        <MovementForm movement={movement} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
