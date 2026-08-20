"use client";

import { type ReactNode } from "react";
import { FormDialog } from "@/modules/shared/ui/common/FormDialog";
import { useTranslations } from "next-intl";
import { AccountForm } from "./AccountForm";
import type { AccountView } from "../types/types";

type AccountDialogProps = {
  trigger: ReactNode;
  account?: AccountView;
};

export function AccountDialog({
  trigger,
  account,
}: Readonly<AccountDialogProps>) {
  const t = useTranslations("accounts");
  const title = account ? t("editTitle") : t("addTitle");

  return (
    <FormDialog trigger={trigger} title={title}>
      {({ onSuccess }) => (
        <AccountForm account={account} onSuccess={onSuccess} />
      )}
    </FormDialog>
  );
}
