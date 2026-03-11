import { getCategories } from "@/modules/categories/services/categories";
import { getTranslations } from "next-intl/server";
import { ToastManager } from "@/modules/shared/ui/Toast/toast-manager";
import { AddButton } from "@/modules/dashboard/ui/ActionBar/AddButton";
import { mapCategories } from "../adapters/categories.adapter";
import { CategoryGroup } from "../ui/CategoryGroup";

export async function CategoriesPage() {
  const [t, categories] = await Promise.all([
    getTranslations(),
    getCategories(),
  ]);

  const mappedCategories = mapCategories(categories);

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-1 text-sm">
          <h3>{t("settings.title")}</h3>
          <span className="text-gray-500">/</span>
          <h3 className="font-semibold">{t("settings.categories")}</h3>
        </div>
        <AddButton href="/settings/categories/create" />
      </div>

      <div className="flex flex-col gap-3">
        {mappedCategories.map((category) => (
          <CategoryGroup
            key={category.id}
            id={category.id as number}
            isCustomName={category.is_custom_name ?? false}
            isGlobal={category.is_global ?? false}
            isHidden={category.is_hidden ?? false}
            subcategories={category.children}
            color={category.color ?? "gray"}
            icon={category.icon ?? "transfer"}
            title={category.title ?? ""}
          />
        ))}
      </div>

      <ToastManager />
    </>
  );
}
