"use client";
import { CategoryView } from "@/modules/categories/types/types";
import { getCategoryLabel } from "@/modules/categories/utils/getCategoryLabel";
import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";
import { cn } from "@/modules/shared/utils/cn";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useTranslations } from "next-intl";

type Props = Readonly<{
  categories: CategoryView[];
  category?: string;
  setCategory: (v: string) => void;
  labelKey?: string;
  error?: string;
  allowNull?: boolean;
  disabled?: boolean;
}>;

export function CategorySelect({
  categories,
  category,
  setCategory,
  labelKey = "chooseCategory",
  error,
  allowNull = false,
  disabled = false,
}: Props) {
  const tCommon = useTranslations("common");
  const tCategories = useTranslations("categories");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className={cn("block text-sm font-medium", error && "text-red-500")}
      >
        {tCommon(labelKey)}
      </label>
      <Select
        disabled={disabled}
        value={category ?? ""}
        onValueChange={setCategory}
      >
        <SelectTrigger className={error ? "border border-rose-500" : ""}>
          <SelectValue placeholder={tCommon("selectCategory")} />
        </SelectTrigger>
        <SelectContent className="max-h-56">
          <SelectGroup>
            {allowNull && (
              <SelectItem value={null as unknown as string}>
                <div className="flex items-center">
                  <p>{tCategories("noCategory")}</p>
                </div>
              </SelectItem>
            )}
            {categories.map((item: CategoryView) => (
              <SelectItem key={item.id} value={item.id}>
                <div className="flex items-center">
                  <CategoryIcon
                    icon={item.icon ?? "transfer"}
                    color={item.color ?? "gray"}
                    size={14}
                  />
                  <p className="ml-2">
                    {getCategoryLabel(
                      item.title,
                      item.isGlobal,
                      item.isCustomName,
                      tCategories,
                    )}
                  </p>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && (
        <div id="category-error" aria-live="polite" aria-atomic="true">
          <p className="text-xs text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
}
