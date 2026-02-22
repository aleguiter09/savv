import Link from "next/link";
import { getMovementById } from "@/modules/movements/services/movements";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { MovementDetail } from "@/modules/movements/ui/MovementDetail/MovementDetail";
import { DeleteMovementButton } from "../ui/DeleteMovementButton";
import { parseMovementDetails } from "../adapters/movements.adapter";

type MovementDetailPageProps = {
  id: number;
};

export async function MovementDetailPage({ id }: MovementDetailPageProps) {
  const [t, movement] = await Promise.all([
    getTranslations("movements"),
    getMovementById(id),
  ]);

  if (!movement) {
    notFound();
  }

  const parsedMovement = parseMovementDetails(movement);

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/">
          <ArrowLeft />
        </Link>
        <h4 className="font-medium">{t("detailsTitle")}</h4>
        <DeleteMovementButton movement={movement} />
      </div>

      <MovementDetail {...parsedMovement} />
    </>
  );
}
