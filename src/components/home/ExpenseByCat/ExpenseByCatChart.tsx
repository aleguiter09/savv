import { getExpenses } from "@/services/movements";
import { createClient } from "@/utils/supabase-server";
import { DonutChart } from "@tremor/react";

export default async function ExpenseByCatChart({
  account,
}: Readonly<{ account: number }>) {
  const parseMovements = (
    movements: {
      amount: number;
      category: string;
      fullCategory?: { title: string; color: string } | null;
    }[]
  ) => {
    const result: { title: string; amount: number; color: string }[] = [];
    const colors: string[] = [];
    for (const movement of movements) {
      const { amount, fullCategory } = movement;
      const dataItem = result.find(
        (item) => item.title === fullCategory?.title
      );
      if (!dataItem) {
        result.push({
          title: fullCategory?.title ?? "Uncategorized",
          amount: amount,
          color: fullCategory?.color ?? "gray-500",
        });
        colors.push(fullCategory?.color ?? "gray");
      } else {
        dataItem.amount += amount;
      }
    }
    return { result, colors };
  };

  const supabase = createClient();
  const movements = await getExpenses(supabase, account);
  const { result: data, colors } = parseMovements(movements);
  const total = data.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="flex gap-3 items-center">
      <DonutChart
        data={data}
        category="amount"
        index="title"
        colors={colors}
        label={`$${total.toFixed(2)}`}
      />
      <div className="space-y-2">
        {data
          .toSorted((a, b) => b.amount - a.amount)
          .slice(0, 3)
          .map((item) => (
            <div
              key={item.title}
              className="rounded-tremor-default text-tremor-default bg-tremor-background p-2 shadow-tremor-dropdown border border-tremor-border"
            >
              <div className="flex space-x-2.5">
                <div
                  className={`w-1.5 flex flex-col bg-${item?.color} rounded`}
                />
                <div className="w-full">
                  <div className="flex items-center justify-between space-x-8">
                    <p className="text-right text-slate-500 whitespace-nowrap">
                      {item.title}
                    </p>
                    <p className="font-medium text-right whitespace-nowrap">
                      ${item.amount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
