import { getCategories } from "@/modules/categories/services/categories";
import { getTranslations } from "next-intl/server";
import { mapCategories } from "../adapters/categories.adapter";
import { CategoryClient } from "../ui/CategoryClient";

export async function CategoriesPage() {
  const [t, categories] = await Promise.all([
    getTranslations("settings"),
    getCategories(),
  ]);

  const mappedCategories = mapCategories(categories);

  return (
    <>
      <div className="mb-2 flex items-center gap-1 text-sm">
        <h3>{t("title")}</h3>
        <span className="text-gray-500">/</span>
        <h3 className="font-semibold">{t("categories")}</h3>
      </div>

      <CategoryClient initialCategories={mappedCategories} />
    </>
  );
}
