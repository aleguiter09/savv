import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";

export async function MovementsPreviewMock() {
  const t = await getTranslations("landing.mocks");

  const rows = [
    {
      label: t("salary"),
      category: t("income"),
      amount: "+2.800,00",
      tone: "text-income",
    },
    {
      label: t("groceries"),
      category: t("food"),
      amount: "−64,50",
      tone: "text-expense",
    },
    {
      label: t("transfer"),
      category: t("checking"),
      amount: "500,00",
      tone: "text-transfer",
    },
    {
      label: t("housing"),
      category: t("housing"),
      amount: "−850,00",
      tone: "text-expense",
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="h-full rounded-2xl border border-border/80 bg-background p-4 shadow-xs"
    >
      <Card className="px-4 py-3 shadow-xs">
        <p className="mb-3 text-sm font-semibold text-foreground">
          {t("recent")}
        </p>
        <ul className="space-y-3 text-sm">
          {rows.map((row) => (
            <li
              key={`${row.label}-${row.amount}`}
              className="flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">
                  {row.label}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {row.category}
                </p>
              </div>
              <span className={`shrink-0 font-medium tabular-nums ${row.tone}`}>
                {row.amount}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
