import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCategoryById } from "@/modules/categories/services/categories";
import { CategoryForm } from "@/modules/categories/ui/CategoryForm";
import { ToastManager } from "@/modules/shared/ui/Toast/toast-manager";

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
        <span></span>
      </div>
      <CategoryForm category={category} />
      <ToastManager />
    </>
  );
}
