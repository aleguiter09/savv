import { Category } from "@/types/database";
import { CATEGORY_ICONS } from "@/utils/constants";
import Icon from "@mdi/react";
import { Select, SelectItem } from "@tremor/react";

type CategorySelectProps = {
  categories: Category[];
  category: string;
  setCategory: (v: string) => void;
  error: boolean;
  errorMessage?: string;
};

export default function CategorySelect({
  categories,
  category,
  setCategory,
  error,
  errorMessage,
}: Readonly<CategorySelectProps>) {
  return (
    <div className="flex flex-col gap-1 mb-2">
      <label htmlFor="category-select" className="block text-sm font-medium">
        Choose a category
      </label>
      <Select
        id="category-select"
        placeholder="Select a category"
        enableClear={false}
        value={category}
        onValueChange={(v) => setCategory(v)}
        className={`${error && "border border-rose-500 rounded-lg"}`}
      >
        {categories.map((category: Category) => (
          <SelectItem
            key={category.id}
            value={category.id.toString()}
            icon={() => (
              <Icon
                className={`bg-${category.color} rounded-full p-1`}
                path={CATEGORY_ICONS[category.icon]}
                size={"25px"}
                color="white"
              />
            )}
          >
            <p className="ml-2">{category.title}</p>
          </SelectItem>
        ))}
      </Select>
      {error && (
        <div id="category-error" aria-live="polite" aria-atomic="true">
          <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
