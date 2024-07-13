import { List } from "@tremor/react";
import { getMovementsByDay } from "@/utils/common";
import { createClient } from "@/utils/supabase-server";
import MovementItem from "@/components/movements/MovementsList/MovementItem";
import { getMovementsByFilters } from "@/services/movements";

export default async function MovementsList({
  from,
  to,
  accountId,
  categoryId,
}: Readonly<{ from: Date; to: Date; accountId: number; categoryId: number }>) {
  const supabase = await createClient();
  const { data } = await getMovementsByFilters(
    supabase,
    from,
    to,
    accountId,
    categoryId
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
      {data.length === 0 && (
        <p className="py-2 text-sm text-slate-500 text-center">
          No expenses recored in this period.
        </p>
      )}
    </List>
  );
}
