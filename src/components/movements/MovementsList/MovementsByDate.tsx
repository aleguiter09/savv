import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { LastMovementsSkeleton } from "@/components/home/LastMovements/LastMovementsList";
import { AccountIds, CategoryIds } from "@/types/general";
import { MovementsList } from "./MovementsList";

type Props = Readonly<{
  from: Date;
  to: Date;
  accountId: AccountIds;
  categoryId: CategoryIds;
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
