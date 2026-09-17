import { getTranslations } from "next-intl/server";
import { ArrowUpRight, Eye, ListChecks } from "lucide-react";

export async function ValuePillarsSection() {
  const t = await getTranslations("landing.value");

  const pillars = [
    {
      key: "track",
      icon: <ListChecks className="h-5 w-5 text-primary" aria-hidden />,
    },
    {
      key: "understand",
      icon: <Eye className="h-5 w-5 text-primary" aria-hidden />,
    },
    {
      key: "improve",
      icon: <ArrowUpRight className="h-5 w-5 text-primary" aria-hidden />,
    },
  ] as const;

  return (
    <section
      id={t("id")}
      className="scroll-mt-20 border-t border-border/70 bg-background"
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

        <ul className="mt-14 grid gap-6 sm:grid-cols-3 sm:gap-8">
          {pillars.map((pillar) => (
            <li
              key={pillar.key}
              className="rounded-xl border border-border/80 bg-card p-6 shadow-xs"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-muted">
                {pillar.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                {t(`pillars.${pillar.key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`pillars.${pillar.key}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
