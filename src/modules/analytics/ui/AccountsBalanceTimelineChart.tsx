"use client";

import { AreaChart } from "@/ui/area-chart";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";

type ChartPoint = {
  date: string;
  [key: string]: string | number | null;
};

type Props = Readonly<{
  locale: string;
  data: ChartPoint[];
  categories: string[];
}>;

export function AccountsBalanceTimelineChart({
  locale,
  data,
  categories,
}: Props) {
  const compactNumberFormatter = new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  return (
    <AreaChart
      className="h-72"
      data={data}
      index="date"
      categories={categories}
      valueFormatter={(value) => compactNumberFormatter.format(value)}
      tooltipValueFormatter={(value) => formatCurrency(locale, value, 2)}
      showLegend
      showGridLines
      connectNulls
    />
  );
}
