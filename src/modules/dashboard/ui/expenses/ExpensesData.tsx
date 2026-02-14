import { Suspense } from "react";
import { ExpensesDataChart, ExpensesDataSkeleton } from "./ExpensesDataChart";

type Props = Readonly<{
  accountId: string;
  year: number;
  month: number;
}>;

export async function ExpensesData({ accountId, year, month }: Props) {
  return (
    <Suspense
      key={accountId + year + month}
      fallback={<ExpensesDataSkeleton />}
    >
      <ExpensesDataChart accountId={accountId} year={year} month={month} />
    </Suspense>
  );
}
