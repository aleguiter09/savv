"use client";

import { AreaChart } from "@/ui/area-chart";

export function BalanceTimelineChart({
  data,
  balanceLabel,
}: Readonly<{
  data: any[];
  balanceLabel: string;
}>) {
  return (
    <AreaChart
      className="h-72"
      data={data}
      index="date"
      categories={[balanceLabel]}
      colors={["blue"]}
      showLegend={false}
      fill="solid"
      showGridLines
      tickGap={1}
      allowDecimals
    />
  );
}
