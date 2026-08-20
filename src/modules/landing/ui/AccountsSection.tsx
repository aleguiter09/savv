import { getTranslations } from "next-intl/server";
import {
  Landmark,
  Scale,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { FeatureGrid } from "./FeatureGrid";
import { AccountsPreviewMock } from "./mocks/AccountsPreviewMock";

export async function AccountsSection() {
  const t = await getTranslations("landing.accounts");

  const items = [
    {
      icon: <Wallet className="h-5 w-5 text-blue-600" />,
      title: t("items.multiple.title"),
      description: t("items.multiple.description"),
    },
    {
      icon: <Scale className="h-5 w-5 text-blue-600" />,
      title: t("items.balance.title"),
      description: t("items.balance.description"),
    },
    {
      icon: <Landmark className="h-5 w-5 text-blue-600" />,
      title: t("items.netWorth.title"),
      description: t("items.netWorth.description"),
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
      title: t("items.timeline.title"),
      description: t("items.timeline.description"),
    },
  ];

  return (
    <section id="accounts" className="scroll-mt-20 border-t border-border/70 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
          <FeatureGrid items={items} className="mt-8" />
        </div>
        <AccountsPreviewMock />
      </div>
    </section>
  );
}
