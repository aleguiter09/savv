import { getTranslations } from "next-intl/server";
import { AccountsPreviewMock } from "./mocks/AccountsPreviewMock";
import { AnalyticsPreviewMock } from "./mocks/AnalyticsPreviewMock";
import { HeroDashboardMock } from "./mocks/HeroDashboardMock";
import { MovementsPreviewMock } from "./mocks/MovementsPreviewMock";

export async function ProductShowcaseSection() {
  const t = await getTranslations("landing.showcase");

  return (
    <section
      id={t("id")}
      className="scroll-mt-20 border-t border-border/70 bg-surface"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <AccountsPreviewMock />
          <MovementsPreviewMock />
          <AnalyticsPreviewMock />
        </div>
      </div>
    </section>
  );
}
