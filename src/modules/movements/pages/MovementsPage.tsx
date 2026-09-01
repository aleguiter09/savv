import { MovementsByDate } from "../ui/MovementsList/MovementsByDate";
import { MovementsFilters } from "../ui/MovementsFilter/MovementsFilters";
import { parseMovementsSearchParams } from "../adapters/movements.adapter";

export type MovementsPageProps = {
  from?: string;
  to?: string;
  account?: string;
  category?: string;
  page?: string;
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
