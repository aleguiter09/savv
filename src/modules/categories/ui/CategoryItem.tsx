import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";
import { DeleteCategoryButton } from "./DeleteCategoryButton";
import { Button } from "@/ui/button";
import { Eye, EyeOff, Pencil } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "tailwind-variants";
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
        <Button asChild size="icon" variant="secondary">
          <Link href={`/settings/categories/${id}`}>
            <Pencil size={16} />
          </Link>
        </Button>
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
