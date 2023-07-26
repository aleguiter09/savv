import { valueFormatter } from "@/utils/common";
import { Card, BarChart } from "@tremor/react";

const chartdata = [
  {
    name: "Incomes",
    Incomes: 5000,
  },
  {
    name: "Expenses",
    Expenses: 800,
  },
];

const value = "8000";

export default function Finances() {
  return (
    <Card className="py-2 mb-4 px-3">
      <h5 className="text-sm font-medium mb-3">Movements</h5>
      <BarChart
        data={chartdata}
        index="name"
        categories={["Incomes", "Expenses"]}
        colors={["blue", "red"]}
        valueFormatter={valueFormatter}
        stack="true"
        showAnimation="false"
        yAxisWidth={value.length * 10 + 20}
      />
    </Card>
  );
}
