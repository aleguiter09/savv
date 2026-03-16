import DateSlider from "@/modules/shared/ui/common/DateSlider";
import { getDefaultAccountId } from "@/modules/accounts/services/accounts";
import { ExpensesData } from "@/modules/dashboard/ui/expenses/ExpensesData";
import { ExpensesFilter } from "@/modules/dashboard/ui/expenses/ExpensesFilter";

export type ExpensesPageParams = {
  year?: string;
  month?: string;
  account?: string;
};

export async function ExpensesPage(props: ExpensesPageParams) {
  const { year: yearParam, month: monthParam, account } = props;

  const defaultAcc = await getDefaultAccountId();
  const accountId =
    account ?? (defaultAcc === "0" ? "all" : defaultAcc.toString());

  const year = yearParam ? Number(yearParam) : new Date().getFullYear();
  const month = monthParam ? Number(monthParam) : new Date().getMonth();

  return (
    <>
      <DateSlider year={year} month={month} />
      <ExpensesFilter accountId={accountId} />
      <ExpensesData accountId={accountId} year={year} month={month} />
    </>
  );
}
