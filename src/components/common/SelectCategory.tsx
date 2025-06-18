"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useData } from "@/providers/DataProvider";
import { CategoryIds } from "@/types/general";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type SelectCategoryProps = {
  categoryId: CategoryIds;
};

export function SelectCategory({ categoryId }: Readonly<SelectCategoryProps>) {
  const t = useTranslations("categories");
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
    <Select defaultValue={categoryId.toString()} onValueChange={handleSelect}>
      <SelectTrigger className="w-full max-w-none bg-white">
        <SelectValue placeholder={t("selectPlaceholder")} />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        <SelectItem value="all">{t("allCategories")}</SelectItem>
        <SelectGroup>
          <SelectLabel>{t("incomes")}</SelectLabel>
          <SelectItem value="incomes">{t(`allIncomes`)}</SelectItem>
          {incomeCategories.map((item) => (
            <SelectItem key={item.id} value={item.id.toString()}>
              {t(item.title)}
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectGroup>
          <SelectLabel>{t("expenses")}</SelectLabel>
          <SelectItem value="expenses">{t(`allExpenses`)}</SelectItem>
          {expenseCategories.map((item) => (
            <SelectItem key={item.id} value={item.id.toString()}>
              {t(item.title)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
