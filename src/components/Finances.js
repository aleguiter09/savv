import { useSupabase } from "@/context/supabaseContext";
import { getMovementsByMonthAndYear } from "@/services/database";
import { Card, ProgressBar, List } from "@tremor/react";
import { useEffect, useState } from "react";
import { calculatePercentage, getMovementsByDay } from "@/utils/common";
import FinanceItem from "./FinanceItem";

export default function Finances({ year, month }) {
  const [movements, setMovements] = useState([]);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const { supabase } = useSupabase();

  const getMovs = async () => {
    const data = await getMovementsByMonthAndYear(supabase, year, month);

    const expenses = data.filter((c) => c.type === "expense");
    const incomes = data.filter((c) => c.type === "income");

    const totalInc = incomes.reduce((a, b) => a + b.amount, 0);
    const totalExp = expenses.reduce((a, b) => a + b.amount, 0);

    const items = getMovementsByDay(data);
    setMovements(items);
    setTotalIncomes(totalInc);
    setTotalExpenses(totalExp);
  };

  useEffect(() => {
    getMovs();
  }, [year, month]);

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
