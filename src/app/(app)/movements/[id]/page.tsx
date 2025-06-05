import Icon from "@/components/common/Icon";
import { Icon as MDIIcon } from "@mdi/react";
import MovementDetail from "@/components/movements/MovementDetail/MovementDetail";
import { getMovementById } from "@/services/movements";
import { mdiTrashCanOutline } from "@mdi/js";
import { notFound } from "next/navigation";
import Link from "next/link";
import ConfirmDialog from "@/components/movements/ConfirmDialog/ConfirmDialog";
import { getTranslations } from "next-intl/server";

export default async function MovementDetailPage({
  params,
  searchParams,
}: Readonly<{
  params: { id: string };
  searchParams: { confirm: string };
}>) {
  const t = await getTranslations("movements");
  const id = params.id;
  const confirm = Boolean(searchParams?.confirm === "true");
  const movement = await getMovementById(Number(id));

  if (!movement) {
    notFound();
  }

  const alertDialog = () => {
    return (
      <ConfirmDialog
        movement={movement}
        entity="movements"
        isOpen={confirm}
        button={<MDIIcon path={mdiTrashCanOutline} size="24px" />}
      >
        <h3 className="text-lg font-semibold text-tremor-content-strong">
          {t("areYouSure")}
        </h3>
        <p className="mt-2 leading-5 text-tremor-default text-tremor-content">
          {t("dialogMovement")} {`${movement.comment}`}. <br />
          <br />
          {t("dialogWarning")}
        </p>
      </ConfirmDialog>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/">
          <Icon color="stone" icon="arrow-left" />
        </Link>
        <h4 className="font-medium">{t("detailsTitle")}</h4>
        {alertDialog()}
      </div>
      <MovementDetail {...movement} />
    </>
  );
}
