"use client";
import { useData } from "@/providers/DataProvider";
import { Category } from "@/types/database";
import { Select, SelectItem } from "@tremor/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SelectCategoryProps = {
  categoryId: number;
  containerClassName?: string;
};

export default function SelectCategory({
  categoryId,
  containerClassName = "",
}: Readonly<SelectCategoryProps>) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { incomeCategories, expenseCategories } = useData();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={containerClassName}>
      <Select
        className={containerClassName}
        defaultValue={categoryId.toString()}
        onValueChange={handleSelect}
        enableClear={false}
      >
        <SelectItem value="0">{t("movements.allCategories")}</SelectItem>
        {[...incomeCategories, ...expenseCategories].map((item: Category) => (
          <SelectItem key={item.id} value={item.id.toString()}>
            {t(`categories.${item.title}`)}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
