import DateSlider from "@/components/common/DateSlider";
import ExpensesData from "@/components/expenses/ExpensesData";
import ExpensesFilter from "@/components/expenses/ExpensesFilter";

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
  const year = searchParams.year
    ? Number(searchParams.year)
    : new Date().getFullYear();
  const month = searchParams.month
    ? Number(searchParams.month)
    : new Date().getMonth();
  const account = Number(searchParams.account) || 0;

  return (
    <>
      <DateSlider year={year} month={month} />
      <ExpensesFilter accountId={account} />
      <ExpensesData account={account} year={year} month={month} />
    </>
  );
}
