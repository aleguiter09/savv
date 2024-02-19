import { List } from "@tremor/react";
import { getMovementsByDay } from "@/utils/common";
import { getMovementsByMonthAndYear } from "@/services/movements";
import { createClient } from "@/utils/supabase-server";
import FinanceItem from "@/components/movements/MovementsList/MovementItem";

export default async function MovementsList({
  year,
  month,
}: Readonly<{ year: number; month: number }>) {
  const supabase = await createClient();
  const data = await getMovementsByMonthAndYear(supabase, year, month);
  const movements = getMovementsByDay(data);

  return (
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
  );
}
