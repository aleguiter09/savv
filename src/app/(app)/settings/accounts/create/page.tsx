import { AccountForm } from "@/components/accounts/AccountForm";
import { ToastManager } from "@/components/Toast/toast-manager";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function CreateAccountPage() {
  const t = await getTranslations("accounts");

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/settings/accounts">
          <ArrowLeft />
        </Link>
        <h4 className="font-medium">{t("addTitle")}</h4>
        <span></span>
      </div>
      <AccountForm />
      <ToastManager />
    </>
  );
}
