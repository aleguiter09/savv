import { getMovementsByFilters } from "@/modules/movements/services/movements";
import { getTranslations } from "next-intl/server";
import { MovementItem } from "./MovementItem";
import { getMovementsByDay } from "../../adapters/movements.adapter";

type Props = Readonly<{
  from: Date;
  to: Date;
  accountId: string;
  categoryId: string;
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
        <MovementItem key={item.date} {...item} />
      ))}

      {movements.length === 0 && (
        <p className="py-2 text-sm text-slate-500 text-center">
          {t("noMovementsThisPeriod")}
        </p>
      )}
    </div>
  );
}
