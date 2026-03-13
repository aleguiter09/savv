import { getCategories } from "@/modules/categories/services/categories";
import { getTranslations } from "next-intl/server";
import { ToastManager } from "@/modules/shared/ui/Toast/toast-manager";
import { AddButton } from "@/modules/dashboard/ui/ActionBar/AddButton";
import { mapCategories } from "../adapters/categories.adapter";
import { CategoryClient } from "../ui/CategoryClient";

export async function CategoriesPage() {
  const [t, categories] = await Promise.all([
    getTranslations(),
    getCategories(),
  ]);

  const mappedCategories = mapCategories(categories);

  return (
    <>
      <div className="mb-2 flex justify-between items-center">
        <div className="flex items-center gap-1 text-sm">
          <h3>{t("settings.title")}</h3>
          <span className="text-gray-500">/</span>
          <h3 className="font-semibold">{t("settings.categories")}</h3>
        </div>
        <AddButton href="/settings/categories/create" />
      </div>

      <CategoryClient initialCategories={mappedCategories} />

      <ToastManager />
    </>
  );
}
