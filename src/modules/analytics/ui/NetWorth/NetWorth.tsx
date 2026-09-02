import { getLocale, getTranslations } from "next-intl/server";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";
import type { AnalyticsFiltersParams } from "../../types/analytics-filters.types";
import { getNetWorth } from "../../../dashboard/services/net-worth";
import { Card } from "@/ui/card";

export async function NetWorth({
  from,
  to,
  accountId,
}: Readonly<AnalyticsFiltersParams>) {
  const [locale, netWorth, t] = await Promise.all([
    getLocale(),
    getNetWorth({ from, to, accountId }),
    getTranslations("dashboard"),
  ]);

  const percentChange =
    netWorth.periodStart !== 0
      ? ((netWorth.current - netWorth.periodStart) /
          Math.abs(netWorth.periodStart)) *
        100
      : 0;
  const isPositive = percentChange >= 0;

  const changeDisplay = (
    <div
      className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
    >
      {isPositive ? "▲" : "▼"} {Math.abs(percentChange).toFixed(1)}%
    </div>
  );

  return (
    <Card className="px-3 py-2 border-b-4 border-b-blue-500">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-xs font-semibold text-gray-600">
            {t("netWorthTitle")}
          </p>
          {changeDisplay}
        </div>
        <p
          className={`text-4xl font-bold ${netWorth.current < 0 ? "text-red-600" : ""}`}
        >
          {formatCurrency(locale, netWorth.current, 2)}
        </p>

        <div className="flex gap-1 items-center text-xs text-gray-600">
          {t("netWorthComparedToPeriodStart")}
          <p className={`${netWorth.periodStart < 0 ? "text-red-600" : ""}`}>
            ({formatCurrency(locale, netWorth.current - netWorth.periodStart, 2)})
          </p>
        </div>
      </div>
    </Card>
  );
}
