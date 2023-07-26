import React from "react";
import { Card, List, ListItem, DonutChart, Icon } from "@tremor/react";
import { valueFormatter } from "@/utils/common";

const categories = [
  {
    name: "New York",
    sales: 9800,
  },
  {
    name: "London",
    sales: 4567,
  },
  {
    name: "Hong Kong",
    sales: 3908,
  },
  {
    name: "San Francisco",
    sales: 2400,
  },
  {
    name: "Singapore",
    sales: 1908,
  },
  {
    name: "Zurich",
    sales: 1398,
  },
];

export default function Expense() {
  return (
    <Card className="py-2 px-3">
      <h5 className="text-sm font-medium mb-3">Expenses by category</h5>
      <DonutChart
        data={categories}
        category="sales"
        index="name"
        valueFormatter={valueFormatter}
        colors={["slate", "blue", "indigo", "rose", "cyan", "amber"]}
        showAnimation="false"
      />
      <List>
        {categories.slice(0, 3).map((item) => (
          <ListItem key={item.city} className="">
            <span>{item.name}</span>
            <span>{item.sales}</span>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
