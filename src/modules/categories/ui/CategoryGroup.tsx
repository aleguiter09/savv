import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { ConfirmDeleteButton } from "@/modules/shared/ui/common/ConfirmDeleteButton";
import { deleteCategoryForm } from "../actions/categories.action";
import { CategoryDialog } from "./CategoryDialog";
import { cn } from "@/modules/shared/utils/cn";
import type { CategoryColors } from "@/modules/shared/types/global.types";
import { CategoryItem } from "./CategoryItem";
import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";
import { useTranslations } from "next-intl";
import { getCategoryLabel } from "@/modules/categories/utils/getCategoryLabel";
import type { CategoryClient } from "./CategoryClient";

export type CategoryGroupProps = CategoryClient & {
  handleToggle: (id: number, is_hidden: boolean) => Promise<void>;
};

const BrComponent = () => <br />;

export function CategoryGroup({
  id,
  title,
  icon,
  color,
  isHidden,
  isGlobal,
  isCustomName,
  parentId,
  subcategories,
  handleToggle,
}: CategoryGroupProps) {
  const t = useTranslations("categories");
  const visibleCount = subcategories.filter((c) => !c.isHidden).length;
  const totalCount = subcategories.length;

  return (
    <Card className="shadow-md px-4 py-2">
      <div
        className={cn(
          "flex items-center justify-between py-3",
          isHidden && "opacity-50",
        )}
      >
        <button className="flex flex-1 items-center gap-3 text-left">
          <CategoryIcon icon={icon} color={color} />
          <div className="flex flex-col flex-1">
            <span
              className={cn(
                "text-sm font-semibold text-foreground",
                isHidden && "line-through text-muted-foreground",
              )}
            >
              {getCategoryLabel(title, isGlobal, isCustomName, t)}
            </span>
            <span className="text-xs text-muted-foreground">
              {visibleCount}/{totalCount} activas
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <CategoryDialog
            id={Number(id)}
            title={title}
            icon={icon}
            color={color as CategoryColors}
            parentId={parentId ? Number(parentId) : undefined}
            isGlobal={isGlobal}
            trigger={
              <Button size="icon" variant="secondary">
                <Pencil size={16} />
              </Button>
            }
          />

          {isGlobal ? (
            <Button
              size="icon"
              variant="secondary"
              onClick={() => handleToggle(Number(id), !isHidden)}
            >
              {isHidden ? (
                <Eye className="size-3.5" />
              ) : (
                <EyeOff className="size-3.5" />
              )}
            </Button>
          ) : (
            <ConfirmDeleteButton
              title={t("areYouSure")}
              description={t.rich("deleteDialog", {
                title,
                br: BrComponent,
              })}
              confirmLabel={t("confirm")}
              cancelLabel={t("cancel")}
              onConfirm={() => deleteCategoryForm(Number(id))}
              successMessage={t("deletedSuccess")}
              resolveErrorMessage={(error) => t(error ?? "databaseError")}
            />
          )}
        </div>
      </div>

      {subcategories.length > 0 && (
        <ul className="border-t">
          {subcategories.map((child) => (
            <CategoryItem
              {...child}
              key={child.id}
              handleToggle={handleToggle}
            />
          ))}
        </ul>
      )}
    </Card>
  );
}
