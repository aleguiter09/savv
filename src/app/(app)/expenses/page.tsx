import { ExpensesPage as DashboardExpensesPage } from "@/modules/dashboard/pages/ExpensesPage";

type ExpensesPageParams = {
  searchParams: Promise<{
    year?: string;
    month?: string;
    account?: string;
  }>;
};

export default async function Page({
  searchParams,
}: Readonly<ExpensesPageParams>) {
  const { year, month, account } = await searchParams;
  return <DashboardExpensesPage year={year} month={month} account={account} />;
}
