import { Suspense } from "react";
import { ExpensesDataChart, ExpensesDataSkeleton } from "./ExpensesDataChart";
import { AccountIds } from "@/types/general";

type Props = Readonly<{
  accountId: AccountIds;
  year: number;
  month: number;
}>;

export async function ExpensesData({ accountId, year, month }: Props) {
  return (
    <Suspense
      key={(accountId === "all" ? 0 : accountId) + year + month}
      fallback={<ExpensesDataSkeleton />}
    >
      <ExpensesDataChart accountId={accountId} year={year} month={month} />
    </Suspense>
  );
}
