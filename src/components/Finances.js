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
    <Card className="mb-4 px-3 py-2">
      <h5 className="mb-3 text-sm font-medium">Movements</h5>
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
