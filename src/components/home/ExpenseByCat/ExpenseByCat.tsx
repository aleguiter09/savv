import { Card } from "@tremor/react";
import { Suspense } from "react";
import ExpenseByCatSkeleton from "./ExpenseByCatSkeleton";
import ExpenseByCatChart from "./ExpenseByCatChart";

export default async function ExpenseByCat({
  account,
}: Readonly<{ account: number }>) {
  return (
    <Card className="mb-4 pl-4 pr-3 py-2 shadow-md">
      <p className="font-semibold mb-2">Expenses by category</p>
      <Suspense key={account} fallback={<ExpenseByCatSkeleton />}>
        <ExpenseByCatChart account={account} />
      </Suspense>
    </Card>
  );
}
