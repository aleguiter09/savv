"use client";
import { Category } from "@/types/database";
import { Select, SelectItem } from "@tremor/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SelectCategoryProps = {
  categoryId: number;
  categories: Category[];
  containerClassName?: string;
};

export default function SelectCategoryClient({
  categoryId,
  categories,
  containerClassName = "",
}: Readonly<SelectCategoryProps>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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
        {categories.map((category: Category) => (
          <SelectItem key={category.id} value={category.id.toString()}>
            {category.title}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
