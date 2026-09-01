"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteMovementForm } from "../actions/movement-action";
import { ConfirmDeleteButton } from "@/modules/shared/ui/common/ConfirmDeleteButton";
import type { MovementView } from "../types/types";

export function DeleteMovementButton({ movement }: { movement: MovementView }) {
  const router = useRouter();

  return (
    <ConfirmDeleteButton
      namespace="movements"
      descriptionValues={{ description: movement.description }}
      onConfirm={() => deleteMovementForm(movement.id)}
      onSuccess={() => router.push("/home")}
      trigger={<Trash2 className="cursor-pointer" />}
    />
  );
}
