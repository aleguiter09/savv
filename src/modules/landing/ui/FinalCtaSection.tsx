import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/ui/button";

export async function FinalCtaSection() {
  const t = await getTranslations("landing");

  return (
    <section className="border-t border-gray-200/80 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="rounded-2xl bg-blue-600 px-6 py-11 text-center text-white sm:px-12 sm:py-12">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("finalCta.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-blue-100 sm:text-lg">
            {t("finalCta.subtitle")}
          </p>
          <Button
            size="lg"
            className="mt-8 h-11 min-w-[10.5rem] bg-white px-6 text-blue-700 hover:bg-blue-50 focus-visible:ring-white"
            asChild
          >
            <Link href="/register">{t("finalCta.button")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
