"use client";

import { AreaChart } from "@/ui/area-chart";

export function BalanceTimelineChart({ data }: { data: any[] }) {
  return (
    <AreaChart
      className="h-72"
      data={data}
      index="date"
      categories={["Balance"]}
      colors={["blue"]}
      showLegend={false}
      fill="solid"
      showGridLines
      tickGap={1}
      allowDecimals
    />
  );
}
