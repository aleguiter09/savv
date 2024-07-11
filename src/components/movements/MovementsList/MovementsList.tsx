import { List } from "@tremor/react";
import { getMovementsByDay } from "@/utils/common";
import { getMovementsByMonthAndYear } from "@/services/movements";
import { createClient } from "@/utils/supabase-server";
import MovementItem from "@/components/movements/MovementsList/MovementItem";
import LoadMore from "./LoadMore";

export default async function MovementsList({
  year,
  month,
  page,
}: Readonly<{ year: number; month: number; page: number }>) {
  const supabase = await createClient();
  const { data, count } = await getMovementsByMonthAndYear(
    supabase,
    year,
    month,
    page
  );
  const movements = getMovementsByDay(data);

  return (
    <List>
      {movements.map((item) => (
        <MovementItem
          key={item.date}
          items={item.movements}
          date={item.date}
          amount={item.total}
        />
      ))}
      {data.length < count && <LoadMore currentPage={page} />}
      {data.length === 0 && (
        <p className="py-2 text-sm text-slate-500 text-center">
          No expenses this month
        </p>
      )}
    </List>
  );
}
