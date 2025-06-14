import { List } from "@tremor/react";
import { getMovementsByDay } from "@/utils/common";
import MovementItem from "@/components/movements/MovementsList/MovementItem";
import { getMovementsByFilters } from "@/services/movements";
import { getTranslations } from "next-intl/server";

export default async function MovementsList({
  from,
  to,
  accountId,
  categoryId,
}: Readonly<{ from: Date; to: Date; accountId: number; categoryId: number }>) {
  const t = await getTranslations("movements");
  const { data } = await getMovementsByFilters(from, to, accountId, categoryId);
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
          {t("noMovementsThisPeriod")}
        </p>
      )}
    </List>
  );
}
