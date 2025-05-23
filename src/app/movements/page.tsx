import MovementsByDate from "@/components/movements/MovementsList/MovementsByDate";
import MovementsFilter from "@/components/movements/MovementsFilter/MovementsFilter";

type MovementsPageParams = {
  searchParams: {
    from?: string;
    to?: string;
    account?: string;
    category?: string;
  };
};

export default async function MovementsPage({
  searchParams,
}: Readonly<MovementsPageParams>) {
  const from = searchParams.from
    ? new Date(searchParams.from)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const to = searchParams.to ? new Date(searchParams.to) : new Date();
  const account = Number(searchParams.account) || 0;
  const category = Number(searchParams.category) || 0;

  return (
    <>
      <MovementsFilter from={from} to={to} categoryId={category} />
      <MovementsByDate
        from={from}
        to={to}
        accountId={account}
        categoryId={category}
      />
    </>
  );
}
