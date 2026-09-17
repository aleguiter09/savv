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
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-14 space-y-8">
          <figure className="mx-auto max-w-3xl">
            <figcaption className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("labels.dashboard")}
            </figcaption>
            <HeroDashboardMock />
          </figure>

          <div className="grid gap-6 md:grid-cols-3">
            <figure>
              <figcaption className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("labels.accounts")}
              </figcaption>
              <AccountsPreviewMock />
            </figure>
            <figure>
              <figcaption className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("labels.movements")}
              </figcaption>
              <MovementsPreviewMock />
            </figure>
            <figure>
              <figcaption className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("labels.analytics")}
              </figcaption>
              <AnalyticsPreviewMock />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
