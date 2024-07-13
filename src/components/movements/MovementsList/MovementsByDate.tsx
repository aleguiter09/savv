import FinancesSkeleton from "@/components/home/LastMovements/LastMovementsSkeleton";
import { Card } from "@tremor/react";
import { Suspense } from "react";
import MovementsList from "./MovementsList";

export default async function MovementsByDate({
  from,
  to,
  accountId,
  categoryId,
}: Readonly<{ from: Date; to: Date; accountId: number; categoryId: number }>) {
  return (
    <Card decoration="bottom" className="mb-4 px-3 py-2">
      <Suspense
        key={from.toString() + to.toString() + accountId + categoryId}
        fallback={<FinancesSkeleton />}
      >
        <MovementsList
          from={from}
          to={to}
          accountId={accountId}
          categoryId={categoryId}
        />
      </Suspense>
    </Card>
  );
}
