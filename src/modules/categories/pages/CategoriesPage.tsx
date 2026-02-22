import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { getCategories } from "@/modules/categories/services/categories";
import { getTranslations } from "next-intl/server";
import { EyeIcon, Pencil } from "lucide-react";
import Link from "next/link";
import { ToastManager } from "@/modules/shared/ui/Toast/toast-manager";
import { AddButton } from "@/modules/dashboard/ui/ActionBar/AddButton";
import { DeleteCategoryButton } from "@/modules/categories/ui/DeleteCategoryButton";
import { mapCategories } from "../adapters/categories.adapter";

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

      {mappedCategories.map((category) => (
        <Card key={category.id} className="mb-4 shadow-md pl-4 pr-3 pt-2 pb-3">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">
              {category.is_global && !category.is_custom_name
                ? t("categories." + category.title)
                : category.title}
            </p>

            <div className="flex items-center gap-2">
              <Button asChild size="icon" className="p-0" variant="secondary">
                <Link href={`/settings/categories/${category.id}`}>
                  <Pencil size={16} />
                </Link>
              </Button>
              {!category.is_global && (
                <DeleteCategoryButton
                  id={category.id as number}
                  title={category.title as string}
                />
              )}
            </div>
          </div>
          <ul className="flex flex-col">
            {category.children.map((child) => (
              <li
                key={child.id}
                className="flex items-center py-2 justify-between border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-center gap-3 min-h-9">
                  <div className="w-5 h-5 flex items-center justify-center gap-3">
                    <CategoryIcon
                      icon={child.icon ?? "transfer"}
                      color={child.color ?? "gray"}
                      size="18px"
                      padding="p-1"
                    />
                  </div>
                  <p className="text-sm">
                    {child.is_global && !child.is_custom_name
                      ? t("categories." + child.title)
                      : child.title}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    size="icon"
                    className="p-0"
                    variant="secondary"
                  >
                    <Link href={`/settings/categories/${child.id}`}>
                      <Pencil size={16} />
                    </Link>
                  </Button>
                  {child.is_global ? (
                    <Button size="icon" variant="secondary">
                      <EyeIcon size={16} />
                    </Button>
                  ) : (
                    <DeleteCategoryButton
                      id={child.id as number}
                      title={child.title as string}
                    />
                  )}
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
