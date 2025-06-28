import { EditMovementForm } from "@/components/movements/CreateMovement/EditMovementForm";
import { getMovementById } from "@/services/movements";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditMovementPage({
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

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href={`/movements/${id}`}>
          <ArrowLeft />
        </Link>
        <h4 className="font-medium">{t("editTitle")}</h4>
        <span></span>
      </div>
      <EditMovementForm movement={movement} />
    </>
  );
}
