import { getTranslations } from "next-intl/server";
import { Eye, Layers, Target } from "lucide-react";

export async function ProblemsSection() {
  const t = await getTranslations("landing.problems");

  const items = [
    {
      icon: <Layers className="h-5 w-5 text-blue-600" />,
      title: t("items.scattered.title"),
      description: t("items.scattered.description"),
    },
    {
      icon: <Eye className="h-5 w-5 text-blue-600" />,
      title: t("items.opaque.title"),
      description: t("items.opaque.description"),
    },
    {
      icon: <Target className="h-5 w-5 text-blue-600" />,
      title: t("items.unplanned.title"),
      description: t("items.unplanned.description"),
    },
  ] as const;

  return (
    <section className="border-t border-gray-200/80 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="max-w-xl">
          <h2 className="font-[family-name:var(--font-landing-display)] text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        </div>

        <ul className="mt-10 grid gap-4">
          {items.map((item) => (
            <li
              key={item.title}
              className="flex gap-4 rounded-xl border border-gray-200 bg-gray-50/80 p-4"
            >
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                {item.icon}
              </div>
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
