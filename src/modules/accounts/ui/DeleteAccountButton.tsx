"use client";

import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/modules/shared/ui/common/ConfirmDialog";
import { deleteAccountForm } from "@/modules/accounts/actions/account-actions";
import { useToastStore } from "@/modules/shared/ui/toast-store";
import { Button } from "@/ui/button";

export function DeleteAccountButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const t = useTranslations("accounts");
  const show = useToastStore((store) => store.show);

  const handleDelete = async () => {
    const res = await deleteAccountForm(id);

    if (res.success) {
      show({ type: "success", message: t("deletedSuccess") });
    } else {
      show({ type: "error", message: t(res.error ?? "defaultError") });
    }
  };

  const trigger = (
    <Button size="icon" className="p-0" variant="secondary">
      <Trash2 className="cursor-pointer" size={16} />
    </Button>
  );

  return (
    <ConfirmDialog
      trigger={trigger}
      title={t("areYouSure")}
      description={
        <>
          {t("dialogAccount")} {name}. <br />
          {t("dialogWarning")}
        </>
      }
      confirmLabel={t("confirm")}
      cancelLabel={t("cancel")}
      onConfirm={handleDelete}
    />
  );
}
