import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";
import { DeleteCategoryButton } from "./DeleteCategoryButton";
import { CategoryDialog } from "./CategoryDialog";
import { Button } from "@/ui/button";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/modules/shared/utils/cn";
import type { CategoryColors } from "@/modules/shared/types/global.types";
import { CategoryView } from "../types/types";

export type CategoryItemProps = CategoryView & {
  handleToggle: (id: number, is_hidden: boolean) => Promise<void>;
};

export function CategoryItem({
  id,
  title,
  color,
  icon,
  isGlobal,
  isCustomName,
  isHidden,
  parentId,
  handleToggle,
}: CategoryItemProps) {
  const t = useTranslations("categories");

  return (
    <li
      className={cn(
        "flex items-center py-2 pl-2 justify-between border-b border-gray-200 last:border-b-0",
        isHidden && "opacity-50",
      )}
    >
      <div className="flex items-center gap-3 min-h-9">
        <CategoryIcon icon={icon} color={color} />
        <p
          className={cn(
            "text-sm",
            isHidden && "line-through text-muted-foreground",
          )}
        >
          {isGlobal && !isCustomName ? t(title) : title}
        </p>
      </div>
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
          <DeleteCategoryButton id={Number(id)} title={title} />
        )}
      </div>
    </li>
  );
}
