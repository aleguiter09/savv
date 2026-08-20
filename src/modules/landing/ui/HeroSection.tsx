import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/ui/button";
import { HeroDashboardMock } from "./mocks/HeroDashboardMock";

export async function HeroSection() {
  const t = await getTranslations("landing");

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12),_transparent_55%)]"
      />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-12 lg:pb-20 lg:pt-16">
        <div className="text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-landing-display)] text-[1.85rem] font-semibold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-[2.65rem] lg:leading-[1.15]">
            <span className="block text-blue-600">{t("brand")}</span>
            <span className="mt-1 block">{t("hero.headline")}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mx-auto sm:max-w-sm lg:mx-0 lg:max-w-none lg:flex-row">
            <Button size="lg" className="min-h-12 w-full lg:w-auto" asChild>
              <Link href="/register">{t("cta.register")}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-h-12 w-full lg:w-auto"
              asChild
            >
              <a href="#how-it-works">{t("cta.seeHow")}</a>
            </Button>
          </div>
        </div>

        <div className="motion-safe:animate-[landing-rise_800ms_ease-out]">
          <HeroDashboardMock label={t("hero.previewLabel")} />
        </div>
      </div>
    </section>
  );
}
