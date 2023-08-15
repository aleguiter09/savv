import { useSupabase } from "@/context/supabaseContext";
import { getMovements } from "@/services/database";
import { CATEGORY_ICONS } from "@/utils/constants";
import { Card, ProgressBar, List, ListItem } from "@tremor/react";
import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { calculatePercentage } from "@/utils/common";

export default function Finances() {
  const [movements, setMovements] = useState([]);
  const [totalIncomes, setTotalIncomes] = useState(1);
  const [totalExpenses, setTotalExpenses] = useState(1);
  const { supabase } = useSupabase();

  const getMovs = async () => {
    const data = await getMovements(supabase);

    const expenses = data.filter((c) => c.type === "expense");
    const incomes = data.filter((c) => c.type === "income");

    const totalInc = incomes.reduce((a, b) => a + b.amount, 0);
    const totalExp = expenses.reduce((a, b) => a + b.amount, 0);

    setMovements(data);
    setTotalIncomes(totalInc);
    setTotalExpenses(totalExp);
  };

  useEffect(() => {
    getMovs();
  }, []);

  return (
    <Card className="mb-4 px-3 py-2">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <p className="mb-1 text-sm font-semibold">Incomes</p>
          <p>${totalIncomes}</p>
        </div>
        <div className="flex flex-col text-right">
          <p className="mb-1 text-sm font-semibold">Expenses</p>
          <p>${totalExpenses}</p>
        </div>
      </div>
      <ProgressBar
        value={calculatePercentage(totalIncomes, totalExpenses)}
        color="blue"
        className="mb-2 mt-3"
      />
      <List>
        {movements.map((item) => (
          <ListItem key={item.id} className="text-black">
            <div className="flex items-center gap-2">
              <div className="flex flex-col text-center">
                <Icon
                  className={`bg-${item.fullCategory.color} mx-auto rounded-full p-1.5`}
                  path={CATEGORY_ICONS[item.fullCategory.icon]}
                  size={"30px"}
                  color="white"
                />
              </div>
              <span>{item.comment}</span>
            </div>
            <span>
              {`${item.type === "expense" ? "-" : ""}
              $${item.amount}`}
            </span>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
