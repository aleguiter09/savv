import type { EffectiveCategory } from "@/modules/shared/types/global.types";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DeleteCategoryButton } from "./DeleteCategoryButton";
import { cn } from "@/modules/shared/utils/cn";
import { CategoryItem } from "./CategoryItem";
import Link from "next/link";
import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";

export type CategoryGroupProps = {
  id: number;
  title: string;
  icon: string;
  color: string;
  isHidden: boolean;
  isGlobal: boolean;
  isCustomName: boolean;
  subcategories: EffectiveCategory[];
};

export async function CategoryGroup({
  id,
  title,
  icon,
  color,
  isHidden,
  isGlobal,
  isCustomName,
  subcategories,
}: CategoryGroupProps) {
  const t = await getTranslations("categories");

  return (
    <Card className="shadow-md px-4 py-3">
      <div
        className={cn(
          "flex items-center justify-between py-3",
          isHidden && "opacity-50",
        )}
      >
        <button className="flex flex-1 items-center gap-3 text-left">
          <CategoryIcon icon={icon ?? "transfer"} color={color ?? "gray"} />
          <div className="flex flex-col">
            <span
              className={cn(
                "text-sm font-semibold text-foreground",
                isHidden && "line-through text-muted-foreground",
              )}
            >
              {isGlobal && !isCustomName ? t(title) : title}
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <Button asChild size="icon" variant="secondary">
            <Link href={`/settings/categories/${id}`}>
              <Pencil size={16} />
            </Link>
          </Button>

          {isGlobal ? (
            <Button size="icon" variant="secondary">
              {isHidden ? (
                <Eye className="size-3.5" />
              ) : (
                <EyeOff className="size-3.5" />
              )}
            </Button>
          ) : (
            <DeleteCategoryButton id={id} title={title} />
          )}
        </div>
      </div>

      <ul className="border-t">
        {subcategories.map((child) => (
          <CategoryItem
            key={child.id}
            id={child.id as number}
            title={child.title as string}
            isHidden={child.is_hidden ?? false}
            isGlobal={child.is_global ?? false}
            isCustomName={child.is_custom_name ?? false}
            color={child.color ?? "gray"}
            icon={child.icon ?? "transfer"}
          />
        ))}
      </ul>
    </Card>
  );
}
