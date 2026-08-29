import { getTranslations } from "next-intl/server";
import { cn } from "@/modules/shared/utils/cn";

export async function HowItWorksSection() {
  const t = await getTranslations("landing.howItWorks");

  const steps = ["1", "2", "3"] as const;

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-t border-gray-200/80 bg-gray-50"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {steps.map((step) => (
            <li
              key={step}
              className={cn(
                "rounded-xl border bg-white p-5",
                step === "1"
                  ? "border-blue-200 shadow-sm"
                  : "border-gray-200",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                  step === "1"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700",
                )}
              >
                {step}
              </span>
              <h3 className="mt-4 font-medium text-gray-900">
                {t(`steps.${step}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {t(`steps.${step}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
