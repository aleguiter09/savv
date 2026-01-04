import type { AccountIds, CategoryIds } from "@/types/general";
import { MovementsFilter } from "@/components/movements/MovementsFilter/MovementsFilter";
import { MovementsByDate } from "@/components/movements/MovementsList/MovementsByDate";
import { getDefaultAccountId } from "@/services/accounts";

type Props = Readonly<{
  searchParams: {
    from?: string;
    to?: string;
    account?: string;
    category?: string;
  };
}>;

export default async function MovementsPage({ searchParams }: Props) {
  const defaultAcc = await getDefaultAccountId();
  const accountId =
    searchParams.account ?? (defaultAcc === 0 ? "all" : defaultAcc);
  const categoryId = searchParams.category ?? "all";
  const from = searchParams.from
    ? new Date(searchParams.from)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const to = searchParams.to ? new Date(searchParams.to) : new Date();

  return (
    <>
      <MovementsFilter
        from={from}
        to={to}
        accountId={accountId as AccountIds}
        categoryId={categoryId as CategoryIds}
      />
      <MovementsByDate
        from={from}
        to={to}
        accountId={accountId as AccountIds}
        categoryId={categoryId as CategoryIds}
      />
    </>
  );
}
