"use client";

import { AreaChart } from "@/ui/area-chart";

export function BalanceTimelineChart({ data }: { data: any[] }) {
  console.log("data", data);

  return (
    <AreaChart
      className="h-72"
      data={data}
      index="date"
      categories={["Balance"]}
      colors={["blue"]}
      showLegend={false}
      yAxisWidth={60}
      showGridLines={false}
    />
  );
}
