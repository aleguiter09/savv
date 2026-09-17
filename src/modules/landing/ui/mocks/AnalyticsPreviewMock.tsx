import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";

export async function AnalyticsPreviewMock() {
  const t = await getTranslations("landing.mocks");

  const categories = [
    { name: t("food"), width: "72%", amount: "640" },
    { name: t("housing"), width: "54%", amount: "850" },
    { name: t("transport"), width: "28%", amount: "210" },
  ];

  return (
    <div
      aria-hidden="true"
      className="h-full rounded-2xl border border-border/80 bg-background p-4 shadow-xs"
    >
      <Card className="mb-3 border-b-4 border-b-primary px-4 py-3 shadow-xs">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">{t("income")}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-income">
              3.200
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">{t("expense")}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-expense">
              1.850
            </p>
          </div>
        </div>
      </Card>
      <Card className="px-4 py-3 shadow-xs">
        <p className="mb-3 text-sm font-semibold text-foreground">
          {t("expense")}
        </p>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.name}>
              <div className="mb-1 flex justify-between gap-2 text-sm">
                <span className="text-foreground">{category.name}</span>
                <span className="tabular-nums text-muted-foreground">
                  {category.amount}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: category.width }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
