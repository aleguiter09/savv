import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCategoryById } from "@/services/categories";
import { CategoryForm } from "@/components/categories/CategoryForm";

export default async function EditCategoryPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const t = await getTranslations("categories");
  const id = params.id;
  const category = await getCategoryById(Number(id));

  if (!category) {
    notFound();
  }

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/settings/categories">
          <ArrowLeft />
        </Link>
        <h4 className="font-medium">{t("detailsTitle")}</h4>
      </div>
      <CategoryForm category={category} />
    </>
  );
}
