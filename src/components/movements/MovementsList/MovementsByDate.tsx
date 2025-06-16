import { Suspense } from "react";
import MovementsList from "./MovementsList";
import { Card } from "@/components/ui/card";
import { LastMovementsSkeleton } from "@/components/home/LastMovements/LastMovementsList";

export default async function MovementsByDate({
  from,
  to,
  accountId,
  categoryId,
}: Readonly<{ from: Date; to: Date; accountId: number; categoryId: number }>) {
  return (
    <Card className="mb-4 px-3 py-2  border-b-4 border-b-blue-600">
      <Suspense
        key={from.toString() + to.toString() + accountId + categoryId}
        fallback={<LastMovementsSkeleton />}
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
