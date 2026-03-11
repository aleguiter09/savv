import { getAccountById } from "@/modules/accounts/services/accounts";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { deleteAccountForm } from "@/modules/accounts/actions/account-actions";
import { ConfirmDelete } from "@/modules/shared/ui/common/ConfirmDelete";
import Link from "next/link";
import { AccountForm } from "@/modules/accounts/ui/AccountForm";
import { ToastManager } from "@/modules/shared/ui/Toast/toast-manager";

type EditAccountPageProps = {
  params: { id: string };
};

export default async function Page({
  params,
}: Readonly<EditAccountPageProps>) {
  const t = await getTranslations("accounts");
  const { id } = await params;
  const account = await getAccountById(Number(id));

  if (!account) {
    notFound();
  }

  const handleDelete = async () => {
    "use server";
    await deleteAccountForm(account);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/settings/accounts">
          <ArrowLeft />
        </Link>
        <h4 className="font-medium">{t("detailsTitle")}</h4>
        <ConfirmDelete deleteAction={handleDelete}>
          <span className="mt-2 text-gray-500">
            {t("dialogAccount")} {`${account.name}`}. <br />
            {t("dialogWarning")}
          </span>
        </ConfirmDelete>
      </div>
      <AccountForm account={account} />

      <ToastManager />
    </>
  );
}
