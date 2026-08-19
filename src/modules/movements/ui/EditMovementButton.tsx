"use client";

import { useTranslations } from "next-intl";
import { MovementDialog } from "./MovementDialog";
import type { MovementView } from "../types/types";

export function EditMovementButton({
  movement,
}: Readonly<{ movement: MovementView }>) {
  const t = useTranslations("movements");

  return (
    <MovementDialog
      movement={movement}
      trigger={
        <button
          type="button"
          className="w-full cursor-pointer rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t("edit")}
        </button>
      }
    />
  );
}
