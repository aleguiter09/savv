import { getTranslations } from "next-intl/server";

type CategoriesTranslator = Awaited<
  ReturnType<typeof getTranslations<"categories">>
>;

export function getCategoryLabel(
  title: string,
  isGlobal: boolean,
  isCustomName: boolean,
  t: CategoriesTranslator,
) {
  if (isGlobal && !isCustomName) {
    return t(title);
  }

  return title;
}
