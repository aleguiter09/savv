import { getMovementsByDay } from "@/utils/common";
import { getMovementsByFilters } from "@/services/movements";
import { getTranslations } from "next-intl/server";
import { AccountIds, CategoryIds } from "@/types/general";
import { MovementItem } from "./MovementItem";

type Props = Readonly<{
  from: Date;
  to: Date;
  accountId: AccountIds;
  categoryId: CategoryIds;
}>;

export async function MovementsList({
  from,
  to,
  accountId,
  categoryId,
}: Props) {
  const t = await getTranslations("movements");
  const data = await getMovementsByFilters(from, to, accountId, categoryId);
  const movements = getMovementsByDay(data);

  return (
    <div>
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
    </div>
  );
}
