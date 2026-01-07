import { CategoryIcon } from "@/components/common/CategoryIcon";
import { AddButton } from "@/components/home/ActionBar/AddButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCategories } from "@/services/categories";
import { getTranslations } from "next-intl/server";
import { Pencil, Trash } from "lucide-react";
import { ToastManager } from "@/components/Toast/toast-manager";

export default async function CategoriesPage() {
  const t = await getTranslations();
  const categories = await getCategories();

  const parentCategories = categories.filter(
    (category) => category.parent_id === null
  );

  const mappedCategories = parentCategories.map((category) => {
    const children = categories.filter(
      (child) => child.parent_id === category.id
    );

    return {
      ...category,
      children,
    };
  });

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
      {mappedCategories.map((category) => (
        <Card key={category.id} className="mb-4 shadow-md pl-4 pr-3 pt-2 pb-3">
          <p className="font-semibold mb-2">
            {t("categories." + category.title)}
          </p>
          <ul className="flex flex-col gap-2">
            {category.children.map((child) => (
              <li
                key={child.id}
                className="flex items-center justify-between py-1 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center gap-3">
                    <CategoryIcon
                      icon={child.icon ?? "transfer"}
                      color={child.color ?? "gray"}
                      size="18px"
                      padding="p-[4px]"
                    />
                  </div>
                  <p className="text-sm">{t("categories." + child.title)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" className="p-0" variant="secondary">
                    <Pencil size={16} />
                  </Button>
                  <Button size="icon" className="p-0" variant="secondary">
                    <Trash size={16} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ))}

      <ToastManager />
    </>
  );
}
