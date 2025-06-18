import { Suspense } from "react";
import { ExpensesDataChart, ExpensesDataSkeleton } from "./ExpensesDataChart";

export async function ExpensesData({
  account,
  year,
  month,
}: Readonly<{
  account: number;
  year: number;
  month: number;
}>) {
  return (
    <Suspense key={account + year + month} fallback={<ExpensesDataSkeleton />}>
      <ExpensesDataChart account={account} year={year} month={month} />
    </Suspense>
  );
}
