"use client";

import { Button } from "@/ui/button";
import { applyMovementNowForm } from "@/modules/movements/actions/movement-action";
import { showToast } from "@/modules/shared/ui/toast";
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
            showToast({ type: "success", message: t("appliedSuccess") });
            router.refresh();
          } else {
            showToast({ type: "error", message: t(res.error ?? "defaultError") });
          }
        });
      }}
    >
      {t("applyToday")}
    </Button>
  );
}
