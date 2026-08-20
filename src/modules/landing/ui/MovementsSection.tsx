import { getTranslations } from "next-intl/server";
import {
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
  Tags,
} from "lucide-react";
import { FeatureGrid } from "./FeatureGrid";
import { MovementsPreviewMock } from "./mocks/MovementsPreviewMock";

export async function MovementsSection() {
  const t = await getTranslations("landing.movements");

  const items = [
    {
      icon: <ArrowDownLeft className="h-5 w-5 text-green-600" />,
      title: t("items.income.title"),
      description: t("items.income.description"),
    },
    {
      icon: <ArrowUpRight className="h-5 w-5 text-red-600" />,
      title: t("items.expense.title"),
      description: t("items.expense.description"),
    },
    {
      icon: <ArrowLeftRight className="h-5 w-5 text-blue-600" />,
      title: t("items.transfer.title"),
      description: t("items.transfer.description"),
    },
    {
      icon: <Tags className="h-5 w-5 text-blue-600" />,
      title: t("items.categories.title"),
      description: t("items.categories.description"),
    },
  ];

  return (
    <section id="movements" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
        <div className="order-2 lg:order-1">
          <MovementsPreviewMock />
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
          <FeatureGrid items={items} className="mt-8" />
          <p className="mt-6 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-gray-700">
            {t("transferNote")}
          </p>
        </div>
      </div>
    </section>
  );
}
