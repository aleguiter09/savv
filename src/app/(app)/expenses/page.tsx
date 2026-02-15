import DateSlider from "@/modules/shared/ui/common/DateSlider";
import { getDefaultAccountId } from "@/modules/accounts/services/accounts";
import { ExpensesData } from "@/modules/dashboard/ui/expenses/ExpensesData";
import { ExpensesFilter } from "@/modules/dashboard/ui/expenses/ExpensesFilter";

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
    searchParams.account ??
    (defaultAcc === "0" ? "all" : defaultAcc.toString());

  const year = searchParams.year
    ? Number(searchParams.year)
    : new Date().getFullYear();
  const month = searchParams.month
    ? Number(searchParams.month)
    : new Date().getMonth();

  return (
    <>
      <DateSlider year={year} month={month} />
      <ExpensesFilter accountId={accountId} />
      <ExpensesData accountId={accountId} year={year} month={month} />
    </>
  );
}
