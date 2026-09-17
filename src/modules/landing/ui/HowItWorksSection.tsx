import { getTranslations } from "next-intl/server";

export async function HowItWorksSection() {
  const t = await getTranslations("landing.howItWorks");

  const steps = ["1", "2", "3", "4"] as const;

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-border/70 bg-card"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step}
              className="rounded-xl border bg-card p-5 shadow-sm"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {step}
              </span>
              <h3 className="mt-4 font-medium text-foreground">
                {t(`steps.${step}.title`)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`steps.${step}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
