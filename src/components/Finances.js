import { Card, ProgressBar, List } from "@tremor/react";
import { calculatePercentage, processMovements } from "@/utils/common";
import { getMovementsByMonthAndYear } from "@/services/database";
import { createClient } from "@/utils/supabase-server";
import FinanceItem from "./FinanceItem";

export default async function Finances({ year, month }) {
  const supabase = createClient();

  const data = await getMovementsByMonthAndYear(supabase, year, month);
  const { totalIncomes, totalExpenses, movements } = processMovements(data);

  return (
    <Card className="mb-4 px-3 py-2">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <p className="mb-1 text-sm font-semibold">Incomes</p>
          <p>${totalIncomes.toFixed(2)}</p>
        </div>
        <div className="flex flex-col text-right">
          <p className="mb-1 text-sm font-semibold">Expenses</p>
          <p>${totalExpenses.toFixed(2)}</p>
        </div>
      </div>
      <ProgressBar
        value={calculatePercentage(totalIncomes, totalExpenses)}
        color="blue"
        className="mb-2 mt-3"
      />
      <List>
        {movements.map((item) => (
          <FinanceItem
            key={item.date}
            items={item.movements}
            date={item.date}
            amount={item.total}
          />
        ))}
      </List>
    </Card>
  );
}
