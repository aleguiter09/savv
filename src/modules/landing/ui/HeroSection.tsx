import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/ui/button";
import { HeroDashboardMock } from "./mocks/HeroDashboardMock";

export async function HeroSection() {
  const t = await getTranslations("landing");

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:pb-20">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {t("hero.headline")}
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/register">{t("cta.register")}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#how-it-works">{t("cta.seeHow")}</a>
            </Button>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("hero.previewLabel")}
          </p>
          <HeroDashboardMock />
        </div>
      </div>
    </section>
  );
}
