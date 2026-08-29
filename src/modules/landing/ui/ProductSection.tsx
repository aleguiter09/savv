import { ArrowLeftRight, CalendarClock, Wallet } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function ProductSection() {
  const t = await getTranslations("landing.product");

  const items = [
    {
      icon: Wallet,
      title: t("items.accounts.title"),
      description: t("items.accounts.description"),
    },
    {
      icon: ArrowLeftRight,
      title: t("items.movements.title"),
      description: t("items.movements.description"),
    },
    {
      icon: CalendarClock,
      title: t("items.month.title"),
      description: t("items.month.description"),
    },
  ];

  return (
    <section
      id={t("id")}
      className="scroll-mt-24 border-t border-gray-200/80 bg-white"
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

        <ul className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.title}>
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 max-w-2xl rounded-lg border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm leading-relaxed text-blue-950">
          {t("transferNote")}
        </p>
      </div>
    </section>
  );
}
