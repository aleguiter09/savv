import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/ui/button";

export async function FinalCtaSection() {
  const t = await getTranslations("landing");

  return (
    <section className="border-t border-gray-200/80 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="rounded-2xl border border-blue-100 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.10),_transparent_60%)] px-5 py-10 text-center sm:px-10">
          <h2 className="font-[family-name:var(--font-landing-display)] text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            {t("finalCta.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            {t("finalCta.subtitle")}
          </p>
          <Button size="lg" className="mt-8 min-h-12 w-full sm:w-auto" asChild>
            <Link href="/register">{t("finalCta.button")}</Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            <Link href="/login" className="underline-offset-4 hover:underline">
              {t("cta.login")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
