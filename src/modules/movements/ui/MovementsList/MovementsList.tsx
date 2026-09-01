import { getMovementsByFilters } from "@/modules/movements/services/movements";
import { getTranslations } from "next-intl/server";
import {
  getMovementsByDay,
  MOVEMENTS_PAGE_SIZE,
} from "../../adapters/movements.adapter";
import { MovementsDayGroup } from "./MovementsDayGroup";
import { MovementsPagination } from "./MovementsPagination";

type Props = Readonly<{
  from: Date;
  to: Date;
  accountId: string;
  categoryId: string;
  page: number;
}>;

export async function MovementsList({
  from,
  to,
  accountId,
  categoryId,
  page,
}: Props) {
  const t = await getTranslations("movements");
  const { data, total } = await getMovementsByFilters(
    from,
    to,
    accountId,
    categoryId,
    page,
    MOVEMENTS_PAGE_SIZE,
  );
  const movements = getMovementsByDay(data);

  return (
    <div>
      {movements.map((item) => (
        <MovementsDayGroup key={item.date} {...item} />
      ))}

      {movements.length === 0 && (
        <p className="py-2 text-sm text-slate-500 text-center">
          {t("noMovementsThisPeriod")}
        </p>
      )}

      <MovementsPagination
        page={page}
        total={total}
        pageSize={MOVEMENTS_PAGE_SIZE}
        from={from}
        to={to}
        accountId={accountId}
        categoryId={categoryId}
      />
    </div>
  );
}
