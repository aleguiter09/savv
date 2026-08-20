import { getTranslations } from "next-intl/server";

export async function HowItWorksSection() {
  const t = await getTranslations("landing.howItWorks");

  const steps = ["1", "2", "3", "4"] as const;

  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-gray-200/80">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="max-w-xl">
          <h2 className="font-[family-name:var(--font-landing-display)] text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        </div>

        <ol className="mt-10 grid gap-4">
          {steps.map((step) => (
            <li
              key={step}
              className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {step}
              </span>
              <div>
                <h3 className="font-medium text-gray-900">
                  {t(`steps.${step}.title`)}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t(`steps.${step}.description`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
