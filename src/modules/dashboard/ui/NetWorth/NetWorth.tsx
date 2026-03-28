import { getLocale } from "next-intl/server";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";
import { getNetWorth } from "../../services/net-worth";
import { Card } from "@/ui/card";

export async function NetWorth() {
  const [locale, newWorth] = await Promise.all([getLocale(), getNetWorth()]);

  const percentChange =
    newWorth.pastMonth !== 0
      ? ((newWorth.current - newWorth.pastMonth) /
          Math.abs(newWorth.pastMonth)) *
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
          <p className="text-xs font-semibold text-gray-600">NET WORTH</p>
          {changeDisplay}
        </div>
        <p
          className={`text-4xl font-bold ${newWorth.current < 0 ? "text-red-600" : ""}`}
        >
          {formatCurrency(locale, newWorth.current, 2)}
        </p>

        <div className="flex gap-1 items-center text-xs text-gray-600">
          Comparado hace 30 días
          <p className={`${newWorth.pastMonth < 0 ? "text-red-600" : ""}`}>
            ({formatCurrency(locale, newWorth.current - newWorth.pastMonth, 2)})
          </p>
        </div>
      </div>
    </Card>
  );
}
