import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { MovementsList } from "./MovementsList";
import { LastMovementsSkeleton } from "@/modules/dashboard/ui/LastMovements/LastMovementsList";

type Props = Readonly<{
  from: Date;
  to: Date;
  accountId: string;
  categoryId: string;
}>;

export async function MovementsByDate({
  from,
  to,
  accountId,
  categoryId,
}: Props) {
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
