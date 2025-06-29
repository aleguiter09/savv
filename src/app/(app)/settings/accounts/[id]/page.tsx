import { getAccountById } from "@/services/accounts";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { EditAccountForm } from "@/components/accounts/EditAccountForm";
import { ArrowLeft } from "lucide-react";
import { deleteAccountForm } from "@/utils/actions/account-actions";
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
import Link from "next/link";

export default async function EditAccountPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const t = await getTranslations("accounts");
  const id = params.id;
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
          <p className="mt-2 text-gray-500">
            {t("dialogAccount")} {`${account.name}`}. <br />
            {t("dialogWarning")}
          </p>
        </ConfirmDelete>
      </div>
      <EditAccountForm id={id} account={account} />
    </>
  );
}
