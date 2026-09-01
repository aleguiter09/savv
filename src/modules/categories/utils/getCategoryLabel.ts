import { getTranslations } from "next-intl/server";

export function getCategoryLabel(
  title: string,
  isGlobal: boolean,
  isCustomName: boolean,
  t: Awaited<ReturnType<typeof getTranslations>>,
) {
  if (isGlobal && !isCustomName) {
    return t(`categories.${title}`);
  }

  return title;
}
