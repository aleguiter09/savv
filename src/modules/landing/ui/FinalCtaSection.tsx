import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/ui/button";

export async function FinalCtaSection() {
  const t = await getTranslations("landing");

  return (
    <section className="border-t border-border/70">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="rounded-2xl border border-blue-100 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            {t("finalCta.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
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
