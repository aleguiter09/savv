"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  applyMovementNowForm,
  cancelSeriesForm,
} from "@/modules/movements/actions/movement-action";
import { ConfirmDialog } from "@/modules/shared/ui/common/ConfirmDialog";
import { showToast } from "@/modules/shared/ui/toast";
import { Button } from "@/ui/button";

type Props = Readonly<{
  seriesId: number;
  description: string;
  nextMovementId: number | null;
}>;

export function RecurringSeriesActions({
  seriesId,
  description,
  nextMovementId,
}: Props) {
  const t = useTranslations("dashboard");
  const tMovements = useTranslations("movements");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleApply = () => {
    if (!nextMovementId) return;

    startTransition(async () => {
      const res = await applyMovementNowForm(nextMovementId);
      if (res.success) {
        showToast({ type: "success", message: tMovements("appliedSuccess") });
        router.refresh();
      } else {
        showToast({
          type: "error",
          message: tMovements(res.error ?? "defaultError"),
        });
      }
    });
  };

  const handleCancel = async () => {
    const res = await cancelSeriesForm(seriesId);
    if (res.success) {
      showToast({ type: "success", message: t("cancelSeriesSuccess") });
      router.refresh();
    } else {
      showToast({
        type: "error",
        message: tMovements(res.error ?? "defaultError"),
      });
    }
  };

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {nextMovementId ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          loading={pending}
          onClick={handleApply}
        >
          {tMovements("applyToday")}
        </Button>
      ) : null}

      {nextMovementId ? (
        <Button type="button" size="sm" variant="ghost" asChild>
          <Link href={`/movements/${nextMovementId}`}>{t("editSeries")}</Link>
        </Button>
      ) : null}

      <ConfirmDialog
        title={t("cancelSeriesTitle")}
        description={t("cancelSeriesDescription", { description })}
        confirmLabel={t("cancelSeriesConfirm")}
        cancelLabel={tMovements("cancel")}
        onConfirm={handleCancel}
        trigger={
          <Button type="button" size="sm" variant="destructive">
            {t("cancelSeries")}
          </Button>
        }
      />
    </div>
  );
}
