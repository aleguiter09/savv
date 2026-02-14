import { getMovementById } from "@/modules/movements/services/movements";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { ConfirmDelete } from "@/modules/shared/ui/common/ConfirmDelete";
import { deleteMovementForm } from "@/modules/movements/actions/movement-action";
import Link from "next/link";
import { MovementDetail } from "@/modules/movements/ui/MovementDetail/MovementDetail";

export default async function MovementDetailPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const t = await getTranslations("movements");
  const id = params.id;
  const movement = await getMovementById(Number(id));

  if (!movement) {
    notFound();
  }

  const handleDelete = async () => {
    "use server";
    await deleteMovementForm(movement);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/">
          <ArrowLeft />
        </Link>
        <h4 className="font-medium">{t("detailsTitle")}</h4>
        <ConfirmDelete deleteAction={handleDelete}>
          <p className="mt-2 text-gray-500">
            {t("dialogMovement")} {`${movement.comment}`}. <br />
            {t("dialogWarning")}
          </p>
        </ConfirmDelete>
      </div>
      <MovementDetail {...movement} />
    </>
  );
}
