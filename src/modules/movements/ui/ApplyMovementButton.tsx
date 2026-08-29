"use client";

import { Button } from "@/ui/button";
import { applyMovementNowForm } from "@/modules/movements/actions/movement-action";
import { useToastStore } from "@/modules/shared/ui/toast-store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type ApplyMovementButtonProps = {
  movementId: number;
};

export function ApplyMovementButton({
  movementId,
}: Readonly<ApplyMovementButtonProps>) {
  const t = useTranslations("movements");
  const show = useToastStore((store) => store.show);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      loading={pending}
      className="w-full"
      onClick={() => {
        startTransition(async () => {
          const res = await applyMovementNowForm(movementId);
          if (res.success) {
            show({ type: "success", message: t("appliedSuccess") });
            router.refresh();
          } else {
            show({ type: "error", message: t(res.error ?? "defaultError") });
          }
        });
      }}
    >
      {t("applyToday")}
    </Button>
  );
}
