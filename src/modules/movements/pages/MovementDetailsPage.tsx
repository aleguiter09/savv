import Link from "next/link";
import { getMovementById } from "@/modules/movements/services/movements";
import { getSeriesDetailContext } from "@/modules/movements/services/movement-series";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { MovementDetail } from "@/modules/movements/ui/MovementDetail/MovementDetail";
import { DeleteMovementButton } from "../ui/DeleteMovementButton";
import { adaptMovementItem } from "../adapters/movements.adapter";

type MovementDetailPageProps = {
  id: number;
};

export async function MovementDetailPage({
  id,
}: Readonly<MovementDetailPageProps>) {
  const [t, movement] = await Promise.all([
    getTranslations("movements"),
    getMovementById(id),
  ]);

  if (!movement) {
    notFound();
  }

  const series = movement.series_id
    ? await getSeriesDetailContext(movement.series_id)
    : null;

  const parsedMovement = adaptMovementItem(movement);

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/home">
          <ArrowLeft />
        </Link>
        <h4 className="font-medium">{t("detailsTitle")}</h4>
        <DeleteMovementButton movement={parsedMovement} />
      </div>

      <MovementDetail movement={parsedMovement} series={series} />
    </>
  );
}
