import Icon from "@/components/common/Icon";
import { Icon as MDIIcon } from "@mdi/react";
import ConfirmDialog from "@/components/movements/ConfirmDialog/ConfirmDialog";
import { getAccountById } from "@/services/accounts";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mdiTrashCanOutline } from "@mdi/js";
import { EditAccountForm } from "@/components/accounts/EditAccountForm";

export default async function EditAccountPage({
  params,
  searchParams,
}: Readonly<{
  params: { id: string };
  searchParams: { confirm: string };
}>) {
  const t = await getTranslations("accounts");
  const id = params.id;
  const confirm = Boolean(searchParams?.confirm === "true");
  const account = await getAccountById(Number(id));

  if (!account) {
    notFound();
  }

  const alertDialog = () => {
    return (
      <ConfirmDialog
        entity="accounts"
        account={account}
        isOpen={confirm}
        button={<MDIIcon path={mdiTrashCanOutline} size="24px" />}
      >
        <h3 className="text-lg font-semibold text-tremor-content-strong">
          {t("areYouSure")}
        </h3>
        <p className="mt-2 leading-5 text-tremor-default text-tremor-content">
          {t("dialogAccount")} {`${account.name}`}. <br />
          <br />
          {t("dialogWarning")}
        </p>
      </ConfirmDialog>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/settings/accounts">
          <Icon color="stone" icon="arrow-left" />
        </Link>
        <h4 className="font-medium">{t("detailsTitle")}</h4>
        {alertDialog()}
      </div>
      <EditAccountForm id={id} account={account} />
    </>
  );
}
