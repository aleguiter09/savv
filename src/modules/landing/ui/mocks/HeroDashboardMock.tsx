import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";

export async function HeroDashboardMock() {
  const t = await getTranslations("landing.mocks");

  return (
    <div
      aria-hidden="true"
      className="rounded-2xl border bg-gray-50 p-3 shadow-sm sm:p-4"
    >
      <Card className="mb-3 border-b-4 border-b-blue-600 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("balance")}
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-gray-900">
          12.450,00
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">{t("income")}</p>
            <p className="font-medium text-green-600">+3.200</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t("expense")}</p>
            <p className="font-medium text-red-600">−1.850</p>
          </div>
        </div>
      </Card>

      <Card className="mb-3 px-4 py-3 shadow-md">
        <p className="mb-2 text-sm font-semibold">{t("recent")}</p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between">
            <span>{t("salary")}</span>
            <span className="font-medium text-green-600">+2.800</span>
          </li>
          <li className="flex items-center justify-between">
            <span>{t("groceries")}</span>
            <span className="font-medium text-red-600">−64,50</span>
          </li>
          <li className="flex items-center justify-between">
            <span>{t("transfer")}</span>
            <span className="font-medium text-blue-600">500</span>
          </li>
        </ul>
      </Card>

      <Card className="px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("netWorth")}
        </p>
        <p className="mt-1 text-xl font-semibold tabular-nums">18.920,00</p>
      </Card>
    </div>
  );
}
