import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";
import { DeleteCategoryButton } from "./DeleteCategoryButton";
import { Button } from "@/ui/button";
import { Eye, EyeOff, Pencil } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export type CategoryItemProps = {
  id: number;
  title: string;
  color?: string;
  icon?: string;
  isGlobal?: boolean;
  isCustomName?: boolean;
  isHidden?: boolean;
};

export async function CategoryItem({
  id,
  title,
  color,
  icon,
  isGlobal,
  isCustomName,
  isHidden,
}: CategoryItemProps) {
  const t = await getTranslations("categories");

  return (
    <li className="flex items-center py-2 justify-between border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 min-h-9">
        <div className="w-5 h-5 flex items-center justify-center gap-3">
          <CategoryIcon icon={icon ?? "transfer"} size="18px" />
        </div>
        <p className="text-sm">
          {isGlobal && !isCustomName ? t(title) : title}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild size="icon" className="p-0" variant="secondary">
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
    </li>
  );
}
