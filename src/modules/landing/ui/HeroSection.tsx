import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/ui/button";
import { HeroBrandMark } from "./HeroBrandMark";

export async function HeroSection() {
  const t = await getTranslations("landing");

  return (
    <section className="mx-auto max-w-6xl px-4 py-20  sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.08]">
            {t("hero.headline")}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
            {t("hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button size="lg" asChild>
              <Link href="/register">{t("hero.cta")}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#how-it-works">{t("cta.seeHow")}</a>
            </Button>
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <HeroBrandMark />
        </div>
      </div>
    </section>
  );
}
