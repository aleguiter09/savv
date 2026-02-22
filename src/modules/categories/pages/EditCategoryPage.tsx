import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCategoryById } from "@/modules/categories/services/categories";
import { CategoryForm } from "@/modules/categories/ui/CategoryForm";
import { ToastManager } from "@/modules/shared/ui/Toast/toast-manager";
import { adaptCategoryToForm } from "../adapters/categories.adapter";

type EditCategoryPageProps = { id: number };

export default async function EditCategoryPage({ id }: EditCategoryPageProps) {
  const [t, category] = await Promise.all([
    getTranslations("categories"),
    getCategoryById(id),
  ]);

  if (!category) {
    notFound();
  }

  const adaptedCategory = adaptCategoryToForm(category);

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/settings/categories">
          <ArrowLeft />
        </Link>
        <h4 className="font-medium">{t("detailsTitle")}</h4>
        <span></span>
      </div>
      <CategoryForm {...adaptedCategory} />
      <ToastManager />
    </>
  );
}
