"use client";
import { useData } from "@/providers/DataProvider";
import { Category } from "@/types/database";
import { Select, SelectItem } from "@tremor/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SelectCategoryProps = {
  categoryId: number;
  containerClassName?: string;
};

export default function SelectCategory({
  categoryId,
  containerClassName = "",
}: Readonly<SelectCategoryProps>) {
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
        <SelectItem value="0">All categories</SelectItem>
        {[...incomeCategories, ...expenseCategories].map(
          (category: Category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.title}
            </SelectItem>
          )
        )}
      </Select>
    </div>
  );
}
