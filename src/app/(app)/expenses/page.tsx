import DateSlider from "@/components/common/DateSlider";
import { ExpensesData } from "@/components/expenses/ExpensesData";
import { ExpensesFilter } from "@/components/expenses/ExpensesFilter";
import { getDefaultAccountId } from "@/services/accounts";
import type { AccountIds } from "@/types/general";

type ExpensesPageParams = {
  searchParams: {
    year?: string;
    month?: string;
    account?: string;
  };
};

export default async function ExpensesPage({
  searchParams,
}: Readonly<ExpensesPageParams>) {
  const defaultAcc = await getDefaultAccountId();
  const accountId =
    searchParams.account ?? (defaultAcc === 0 ? "all" : defaultAcc);

  const year = searchParams.year
    ? Number(searchParams.year)
    : new Date().getFullYear();
  const month = searchParams.month
    ? Number(searchParams.month)
    : new Date().getMonth();

  return (
    <>
      <DateSlider year={year} month={month} />
      <ExpensesFilter accountId={accountId as AccountIds} />
      <ExpensesData
        accountId={accountId as AccountIds}
        year={year}
        month={month}
      />
    </>
  );
}
