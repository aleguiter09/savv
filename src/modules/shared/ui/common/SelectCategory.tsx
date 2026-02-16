"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useData } from "@/modules/shared/stores/DataProvider";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type SelectCategoryProps = {
  categoryId: string;
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
    <Select defaultValue={categoryId} onValueChange={handleSelect}>
      <SelectTrigger className="w-full max-w-none bg-white">
        <SelectValue placeholder={t("selectPlaceholder")} />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        <SelectItem value="all">{t("allCategories")}</SelectItem>
        <SelectGroup>
          <SelectLabel>{t("incomes")}</SelectLabel>
          <SelectItem value="incomes">{t(`allIncomes`)}</SelectItem>
          {incomeCategories.map((item) => (
            <SelectItem key={item.id} value={(item.id as number).toString()}>
              {item.user_id ? item.title : t(item.title)}
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectGroup>
          <SelectLabel>{t("expenses")}</SelectLabel>
          <SelectItem value="expenses">{t(`allExpenses`)}</SelectItem>
          {expenseCategories.map((item) => (
            <SelectItem key={item.id} value={(item.id as number).toString()}>
              {item.user_id ? item.title : t(item.title)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
