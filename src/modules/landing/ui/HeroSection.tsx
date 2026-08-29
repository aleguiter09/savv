import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/ui/button";
import { HeroDashboardMock } from "./mocks/HeroDashboardMock";

export async function HeroSection() {
  const t = await getTranslations("landing");

  return (
    <section className="border-b border-gray-200/80 bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:grid-cols-2 lg:gap-14 lg:pb-20 lg:pt-16">
        <div className="max-w-lg">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl sm:leading-[1.08]">
            {t("hero.headline")}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8">
            <Button size="lg" className="h-11 min-w-[10.5rem] px-6" asChild>
              <Link href="/register">{t("cta.register")}</Link>
            </Button>
          </div>
        </div>

        <figure className="w-full min-w-0">
          <figcaption className="mb-2 text-sm text-gray-500">
            {t("hero.previewLabel")}
          </figcaption>
          <HeroDashboardMock />
        </figure>
      </div>
    </section>
  );
}
