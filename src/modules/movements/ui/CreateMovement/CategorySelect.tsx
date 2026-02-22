"use client";
import type { EffectiveCategory } from "@/modules/shared/types/global.types";
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
  categories: EffectiveCategory[];
  category?: string;
  setCategory: (v: string) => void;
  error?: string;
  label?: string;
  allowNull?: boolean;
  disabled?: boolean;
}>;

export function CategorySelect({
  categories,
  category,
  setCategory,
  error,
  label = "movements.chooseCategory",
  allowNull = false,
  disabled = false,
}: Props) {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className={cn("block text-sm font-medium", error && "text-red-500")}
      >
        {t(label)}
      </label>
      <Select
        disabled={disabled}
        value={category ?? ""}
        onValueChange={setCategory}
      >
        <SelectTrigger className={error ? "border border-rose-500" : ""}>
          <SelectValue placeholder={t("movements.selectCategory")} />
        </SelectTrigger>
        <SelectContent className="max-h-56">
          <SelectGroup>
            {allowNull && (
              <SelectItem value={null as unknown as string}>
                <div className="flex items-center">
                  <p>{t("categories.noCategory")}</p>
                </div>
              </SelectItem>
            )}
            {categories.map((item: EffectiveCategory) => (
              <SelectItem key={item.id} value={(item.id as number).toString()}>
                <div className="flex items-center">
                  <CategoryIcon
                    icon={item.icon ?? "transfer"}
                    color={item.color ?? "gray"}
                  />
                  <p className="ml-2">
                    {item.is_global && !item.is_custom_name
                      ? item.title
                      : t(`categories.${item.title}`)}
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
