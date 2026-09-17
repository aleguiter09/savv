import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/ui/button";

export async function FinalCtaSection() {
  const t = await getTranslations("landing");

  return (
    <section className="border-t border-border/70 bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t("finalCta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("finalCta.subtitle")}
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/register">{t("finalCta.button")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
