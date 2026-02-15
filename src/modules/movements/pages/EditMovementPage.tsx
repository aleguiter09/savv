import { getMovementById } from "@/modules/movements/services/movements";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MovementForm } from "@/modules/movements/ui/CreateMovement/MovementForm";

type EditMovementPageProps = { id: string };

export async function EditMovementPage({ id }: EditMovementPageProps) {
  const t = await getTranslations("movements");
  const movement = await getMovementById(Number(id));

  if (!movement) {
    notFound();
  }

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href={`/movements/${id}`}>
          <ArrowLeft />
        </Link>
        <h4 className="font-medium">{t("editTitle")}</h4>
        <span></span>
      </div>

      <MovementForm movement={movement} />
    </>
  );
}
