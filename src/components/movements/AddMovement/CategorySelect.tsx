import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types/database";
import { CATEGORY_ICONS } from "@/utils/constants";
import { useTranslations } from "next-intl";
import Icon from "@mdi/react";

type Props = Readonly<{
  categories: Category[];
  category: string;
  setCategory: (v: string) => void;
  error: boolean;
  errorMessage?: string;
}>;

export function CategorySelect({
  categories,
  category,
  setCategory,
  error,
  errorMessage,
}: Props) {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-2 mb-2">
      <label className="block text-sm font-medium">
        {t("movements.chooseCategory")}
      </label>
      <Select
        defaultValue={category}
        onValueChange={(v) => {
          console.log("Selected category:", v);
          setCategory(v);
        }}
      >
        <SelectTrigger className={`${error && "border border-rose-500"}`}>
          <SelectValue placeholder={t("movements.selectCategory")} />
        </SelectTrigger>
        <SelectContent className="max-h-56">
          <SelectGroup>
            {categories.map((item: Category) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                <div className="flex items-center">
                  <Icon
                    className={`bg-${item.color} rounded-full p-1`}
                    path={CATEGORY_ICONS[item.icon]}
                    size="25px"
                    color="white"
                  />
                  <p className="ml-2">{t(`categories.${item.title}`)}</p>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && (
        <div id="category-error" aria-live="polite" aria-atomic="true">
          <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
