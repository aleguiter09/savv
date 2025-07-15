import { CreateCategoryForm } from "@/components/categories/CreateCategoryForm";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function CreateCategoryPage() {
  const t = await getTranslations("categories");

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/settings/categories">
          <ArrowLeft />
        </Link>
        <h4 className="font-medium">{t("addTitle")}</h4>
        <span></span>
      </div>
      <CreateCategoryForm />
    </>
  );
}
