import { MovementsByDate } from "../ui/MovementsList/MovementsByDate";
import { MovementsFilter } from "../ui/MovementsFilter/MovementsFilter";
import { parseMovementsSearchParams } from "../adapters/movements.adapter";

export type MovementsPageProps = Readonly<{
  searchParams: {
    from?: string;
    to?: string;
    account?: string;
    category?: string;
  };
}>;

export async function MovementsPage({ searchParams }: MovementsPageProps) {
  const params = await parseMovementsSearchParams(searchParams);

  return (
    <>
      <MovementsFilter {...params} />
      <MovementsByDate {...params} />
    </>
  );
}
