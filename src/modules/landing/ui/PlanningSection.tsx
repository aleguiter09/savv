import { getTranslations } from "next-intl/server";
import {
  CalendarClock,
  CreditCard,
  PiggyBank,
  Repeat,
  Target,
} from "lucide-react";
import { Badge } from "@/ui/badge";
import { Card } from "@/ui/card";

export async function PlanningSection() {
  const t = await getTranslations("landing.planning");

  const available = [
    {
      icon: <CalendarClock className="h-5 w-5 text-blue-600" />,
      title: t("available.upcoming.title"),
      description: t("available.upcoming.description"),
    },
    {
      icon: <Target className="h-5 w-5 text-blue-600" />,
      title: t("available.budgets.title"),
      description: t("available.budgets.description"),
    },
  ];

  const roadmap = [
    {
      icon: <Repeat className="h-5 w-5 text-muted-foreground" />,
      title: t("roadmap.recurring.title"),
      description: t("roadmap.recurring.description"),
    },
    {
      icon: <CreditCard className="h-5 w-5 text-muted-foreground" />,
      title: t("roadmap.installments.title"),
      description: t("roadmap.installments.description"),
    },
    {
      icon: <PiggyBank className="h-5 w-5 text-muted-foreground" />,
      title: t("roadmap.projection.title"),
      description: t("roadmap.projection.description"),
    },
  ];

  return (
    <section id="planning" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-600">
              {t("availableTitle")}
            </h3>
            <div className="space-y-3">
              {available.map((item) => (
                <Card key={item.title} className="flex gap-3 p-4 shadow-sm">
                  <div className="mt-0.5">{item.icon}</div>
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t("roadmapTitle")}
              </h3>
              <Badge variant="secondary">{t("roadmapBadge")}</Badge>
            </div>
            <div className="space-y-3">
              {roadmap.map((item) => (
                <Card
                  key={item.title}
                  className="flex gap-3 border-dashed p-4 shadow-none"
                >
                  <div className="mt-0.5">{item.icon}</div>
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{t("roadmapNote")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
