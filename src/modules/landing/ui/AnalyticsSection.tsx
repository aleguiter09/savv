import { getTranslations } from "next-intl/server";
import {
  BarChart3,
  ChartColumn,
  LineChart,
  PieChart,
  Scale,
} from "lucide-react";
import { FeatureGrid } from "./FeatureGrid";
import { AnalyticsPreviewMock } from "./mocks/AnalyticsPreviewMock";

export async function AnalyticsSection() {
  const t = await getTranslations("landing.analytics");

  const items = [
    {
      icon: <BarChart3 className="h-5 w-5 text-blue-600" />,
      title: t("items.cashflow.title"),
      description: t("items.cashflow.description"),
    },
    {
      icon: <PieChart className="h-5 w-5 text-blue-600" />,
      title: t("items.byCategory.title"),
      description: t("items.byCategory.description"),
    },
    {
      icon: <Scale className="h-5 w-5 text-blue-600" />,
      title: t("items.comparison.title"),
      description: t("items.comparison.description"),
    },
    {
      icon: <LineChart className="h-5 w-5 text-blue-600" />,
      title: t("items.evolution.title"),
      description: t("items.evolution.description"),
    },
    {
      icon: <ChartColumn className="h-5 w-5 text-blue-600" />,
      title: t("items.averages.title"),
      description: t("items.averages.description"),
    },
  ];

  return (
    <section id="analytics" className="scroll-mt-20 border-t border-border/70 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
          <FeatureGrid items={items} className="mt-8" />
        </div>
        <AnalyticsPreviewMock />
      </div>
    </section>
  );
}
