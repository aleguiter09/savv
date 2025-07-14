"use client";

import { CategoryIcon } from "@/components/common/CategoryIcon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types/global.types";
import { useTranslations } from "next-intl";

type Props = Readonly<{
  categories: Category[];
  category: string;
  setCategory: (v: string) => void;
  error?: string;
}>;

export function CategorySelect({
  categories,
  category,
  setCategory,
  error,
}: Props) {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-1.5 mb-2">
      <label className="block text-sm font-medium">
        {t("movements.chooseCategory")}
      </label>
      <Select defaultValue={category} onValueChange={setCategory}>
        <SelectTrigger className={`${error && "border border-rose-500"}`}>
          <SelectValue placeholder={t("movements.selectCategory")} />
        </SelectTrigger>
        <SelectContent className="max-h-56">
          <SelectGroup>
            {categories.map((item: Category) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                <div className="flex items-center">
                  <CategoryIcon icon={item.icon} color={item.color} />
                  <p className="ml-2">{t(`categories.${item.title}`)}</p>
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
