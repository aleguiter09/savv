import { MovementForm } from "@/modules/movements/ui/CreateMovement/MovementForm";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function AddMovementPage() {
  const t = await getTranslations("movements");

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/">
          <ArrowLeft />
        </Link>
        <h4 className="font-medium">{t("addTitle")}</h4>
        <span></span>
      </div>
      <MovementForm />
    </>
  );
}
