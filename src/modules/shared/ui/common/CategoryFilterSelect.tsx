"use client";

import { getCategoryLabel } from "@/modules/categories/utils/getCategoryLabel";
import { useData } from "@/modules/shared/stores/DataProvider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useTranslations } from "next-intl";

type Props = Readonly<{
  value: string;
  onValueChange: (value: string) => void;
}>;

export function CategoryFilterSelect({ value, onValueChange }: Props) {
  const t = useTranslations("categories");
  const { incomeCategories, expenseCategories } = useData();

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full max-w-none bg-white">
        <SelectValue placeholder={t("selectPlaceholder")} />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        <SelectItem value="all">{t("allCategories")}</SelectItem>
        <SelectGroup>
          <SelectLabel>{t("incomes")}</SelectLabel>
          <SelectItem value="incomes">{t("allIncomes")}</SelectItem>
          {incomeCategories.map((item) => (
            <SelectItem key={item.id} value={item.id.toString()}>
              {getCategoryLabel(item.title, item.isGlobal, item.isCustomName, t)}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>{t("expenses")}</SelectLabel>
          <SelectItem value="expenses">{t("allExpenses")}</SelectItem>
          {expenseCategories.map((item) => (
            <SelectItem key={item.id} value={item.id.toString()}>
              {getCategoryLabel(item.title, item.isGlobal, item.isCustomName, t)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
