import { Category } from "@/types/database";
import { CATEGORY_ICONS } from "@/utils/constants";
import { Select, SelectItem } from "@tremor/react";
import Icon from "@mdi/react";
import { useTranslations } from "next-intl";

type Props = {
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
}: Readonly<Props>) {
  const t = useTranslations();
  const renderIcon = (color: string, icon: string) => {
    return (
      <Icon
        className={`bg-${color} rounded-full p-1`}
        path={CATEGORY_ICONS[icon]}
        size="25px"
        color="white"
      />
    );
  };

  return (
    <div className="flex flex-col gap-2 mb-2">
      <label htmlFor="category" className="block text-sm font-medium">
        {t("movements.chooseCategory")}
      </label>
      <Select
        id="category"
        placeholder={t("movements.selectCategory")}
        enableClear={false}
        value={category}
        onValueChange={(v) => setCategory(v)}
        className={`${error && "border border-rose-500 rounded-lg"}`}
      >
        {categories.map((item: Category) => (
          <SelectItem
            key={item.id}
            value={item.id.toString()}
            icon={() => renderIcon(item.color, item.icon)}
          >
            <p className="ml-2">{t(`categories.${item.title}`)}</p>
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
