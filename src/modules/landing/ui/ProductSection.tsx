import { getTranslations } from "next-intl/server";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  ChartColumn,
  Landmark,
  LineChart,
  PieChart,
  Scale,
  Tags,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { FeatureGrid } from "./FeatureGrid";
import { AccountsPreviewMock } from "./mocks/AccountsPreviewMock";
import { AnalyticsPreviewMock } from "./mocks/AnalyticsPreviewMock";
import { MovementsPreviewMock } from "./mocks/MovementsPreviewMock";

export async function ProductSection() {
  const tProduct = await getTranslations("landing.product");
  const tAccounts = await getTranslations("landing.accounts");
  const tMovements = await getTranslations("landing.movements");
  const tAnalytics = await getTranslations("landing.analytics");

  const accountItems = [
    {
      icon: <Wallet className="h-5 w-5 text-blue-600" />,
      title: tAccounts("items.multiple.title"),
      description: tAccounts("items.multiple.description"),
    },
    {
      icon: <Scale className="h-5 w-5 text-blue-600" />,
      title: tAccounts("items.balance.title"),
      description: tAccounts("items.balance.description"),
    },
    {
      icon: <Landmark className="h-5 w-5 text-blue-600" />,
      title: tAccounts("items.netWorth.title"),
      description: tAccounts("items.netWorth.description"),
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
      title: tAccounts("items.timeline.title"),
      description: tAccounts("items.timeline.description"),
    },
  ];

  const movementItems = [
    {
      icon: <ArrowDownLeft className="h-5 w-5 text-green-600" />,
      title: tMovements("items.income.title"),
      description: tMovements("items.income.description"),
    },
    {
      icon: <ArrowUpRight className="h-5 w-5 text-red-600" />,
      title: tMovements("items.expense.title"),
      description: tMovements("items.expense.description"),
    },
    {
      icon: <ArrowLeftRight className="h-5 w-5 text-blue-600" />,
      title: tMovements("items.transfer.title"),
      description: tMovements("items.transfer.description"),
    },
    {
      icon: <Tags className="h-5 w-5 text-blue-600" />,
      title: tMovements("items.categories.title"),
      description: tMovements("items.categories.description"),
    },
  ];

  const analyticsItems = [
    {
      icon: <ChartColumn className="h-5 w-5 text-blue-600" />,
      title: tAnalytics("items.month.title"),
      description: tAnalytics("items.month.description"),
    },
    {
      icon: <PieChart className="h-5 w-5 text-blue-600" />,
      title: tAnalytics("items.byCategory.title"),
      description: tAnalytics("items.byCategory.description"),
    },
    {
      icon: <Scale className="h-5 w-5 text-blue-600" />,
      title: tAnalytics("items.comparison.title"),
      description: tAnalytics("items.comparison.description"),
    },
    {
      icon: <LineChart className="h-5 w-5 text-blue-600" />,
      title: tAnalytics("items.evolution.title"),
      description: tAnalytics("items.evolution.description"),
    },
    {
      icon: <Target className="h-5 w-5 text-blue-600" />,
      title: tAnalytics("items.budgets.title"),
      description: tAnalytics("items.budgets.description"),
    },
  ];

  return (
    <section id="product" className="scroll-mt-20 border-t border-gray-200/80">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="max-w-xl">
          <h2 className="font-[family-name:var(--font-landing-display)] text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            {tProduct("title")}
          </h2>
          <p className="mt-3 text-muted-foreground">{tProduct("subtitle")}</p>
        </div>

        <div className="mt-12 space-y-16 lg:space-y-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <h3 className="font-[family-name:var(--font-landing-display)] text-xl font-semibold text-gray-900 sm:text-2xl">
                {tAccounts("title")}
              </h3>
              <p className="mt-2 text-muted-foreground">{tAccounts("subtitle")}</p>
              <FeatureGrid items={accountItems} className="mt-6" />
            </div>
            <AccountsPreviewMock />
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div className="lg:order-2">
              <h3 className="font-[family-name:var(--font-landing-display)] text-xl font-semibold text-gray-900 sm:text-2xl">
                {tMovements("title")}
              </h3>
              <p className="mt-2 text-muted-foreground">{tMovements("subtitle")}</p>
              <FeatureGrid items={movementItems} className="mt-6" />
              <p className="mt-5 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm leading-relaxed text-gray-700">
                {tMovements("transferNote")}
              </p>
            </div>
            <div className="lg:order-1">
              <MovementsPreviewMock />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <h3 className="font-[family-name:var(--font-landing-display)] text-xl font-semibold text-gray-900 sm:text-2xl">
                {tAnalytics("title")}
              </h3>
              <p className="mt-2 text-muted-foreground">{tAnalytics("subtitle")}</p>
              <FeatureGrid items={analyticsItems} className="mt-6" />
            </div>
            <AnalyticsPreviewMock />
          </div>
        </div>
      </div>
    </section>
  );
}
