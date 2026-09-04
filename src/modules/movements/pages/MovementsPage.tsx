import { MovementsByDate } from "../ui/MovementsList/MovementsByDate";
import { MovementsFilters } from "../ui/MovementsFilter/MovementsFilters";
import { parseMovementsSearchParams } from "../adapters/movements.adapter";
import type { MovementsScope } from "../types/types";

export type MovementsPageProps = {
  from?: string;
  to?: string;
  account?: string;
  category?: string;
  page?: string;
  scope?: MovementsScope;
};

export async function MovementsPage(props: Readonly<MovementsPageProps>) {
  const params = await parseMovementsSearchParams(props);

  return (
    <>
      <MovementsFilters {...params} />
      <MovementsByDate {...params} />
    </>
  );
}
