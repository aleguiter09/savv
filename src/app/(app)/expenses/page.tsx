import DateSlider from "@/components/common/DateSlider";
import { ExpensesData } from "@/components/expenses/ExpensesData";
import ExpensesFilter from "@/components/expenses/ExpensesFilter";
import { getDefaultAccountId } from "@/services/accounts";

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
  const account: number =
    Number(searchParams.account) === 0
      ? 0
      : Number(searchParams.account) || defaultAcc;

  const year = searchParams.year
    ? Number(searchParams.year)
    : new Date().getFullYear();
  const month = searchParams.month
    ? Number(searchParams.month)
    : new Date().getMonth();

  return (
    <>
      <DateSlider year={year} month={month} />
      <ExpensesFilter account={account} />
      <ExpensesData account={account} year={year} month={month} />
    </>
  );
}
