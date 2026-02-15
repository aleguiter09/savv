import { MovementsByDate } from "../ui/MovementsList/MovementsByDate";
import { MovementsFilter } from "../ui/MovementsFilter/MovementsFilter";
import { parseMovementsSearchParams } from "../adapters/movements.adapter";

export type MovementsPageProps = {
  from?: string;
  to?: string;
  account?: string;
  category?: string;
};

export async function MovementsPage(props: MovementsPageProps) {
  const params = await parseMovementsSearchParams(props);

  return (
    <>
      <MovementsFilter {...params} />
      <MovementsByDate {...params} />
    </>
  );
}
