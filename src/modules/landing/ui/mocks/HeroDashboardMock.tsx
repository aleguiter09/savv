import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";

export async function HeroDashboardMock() {
  const t = await getTranslations("landing.mocks");

  return (
    <div
      aria-hidden="true"
      className="rounded-2xl border border-border/80 bg-background p-3 shadow-xs sm:p-5"
    >
      <Card className="mb-3 border-b-4 border-b-primary px-4 py-4 shadow-xs">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("balance")}
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground sm:text-3xl">
          12.450,00
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-primary-muted/60 px-3 py-2">
            <p className="text-muted-foreground">{t("income")}</p>
            <p className="mt-0.5 font-medium tabular-nums text-income">+3.200</p>
          </div>
          <div className="rounded-lg bg-surface px-3 py-2">
            <p className="text-muted-foreground">{t("expense")}</p>
            <p className="mt-0.5 font-medium tabular-nums text-expense">−1.850</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="px-4 py-3 shadow-xs">
          <p className="mb-2 text-sm font-semibold">{t("recent")}</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between gap-3">
              <span className="truncate text-foreground">{t("salary")}</span>
              <span className="shrink-0 font-medium tabular-nums text-income">
                +2.800
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="truncate text-foreground">{t("groceries")}</span>
              <span className="shrink-0 font-medium tabular-nums text-expense">
                −64,50
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="truncate text-foreground">{t("transfer")}</span>
              <span className="shrink-0 font-medium tabular-nums text-transfer">
                500
              </span>
            </li>
          </ul>
        </Card>

        <Card className="px-4 py-3 shadow-xs">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("netWorth")}
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">
            18.920,00
          </p>
          <div className="mt-4 flex h-16 items-end gap-1.5">
            {[36, 44, 40, 52, 48, 62, 70].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-sm bg-primary/25 last:bg-primary"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
