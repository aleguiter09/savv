"use client";

import { MovementDialog } from "@/modules/movements/ui/MovementDialog";
import { FloatingAddButton } from "./FloatingAddButton";

export function AddButton() {
  return <MovementDialog trigger={<FloatingAddButton />} />;
}
