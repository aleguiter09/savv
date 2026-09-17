import { getTranslations } from "next-intl/server";

export async function MarginSection() {
  const t = await getTranslations("landing.margin");

  const points = ["clarity", "habits", "room"] as const;

  return (
    <section
      id={t("id")}
      className="scroll-mt-20 border-t border-border/70 bg-background"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <h2 className="max-w-lg text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("body")}
            </p>
          </div>

          <ul className="space-y-4">
            {points.map((point) => (
              <li
                key={point}
                className="rounded-xl border border-border/80 bg-card px-5 py-4 shadow-xs"
              >
                <p className="font-medium text-foreground">
                  {t(`points.${point}.title`)}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {t(`points.${point}.description`)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
