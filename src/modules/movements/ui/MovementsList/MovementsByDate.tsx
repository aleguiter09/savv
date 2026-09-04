import { Suspense } from "react";
import type { MovementsScope } from "../../types/types";
import { MovementsList } from "./MovementsList";
import { MovementsListSkeleton } from "./MovementsListSkeleton";

type Props = Readonly<{
  from: Date;
  to: Date;
  accountId: string;
  categoryId: string;
  page: number;
  scope: MovementsScope;
}>;

export async function MovementsByDate({
  from,
  to,
  accountId,
  categoryId,
  page,
  scope,
}: Props) {
  return (
    <Suspense
      key={`${scope}-${from.getTime()}-${to.getTime()}-${accountId}-${categoryId}-${page}`}
      fallback={<MovementsListSkeleton />}
    >
      <MovementsList
        from={from}
        to={to}
        accountId={accountId}
        categoryId={categoryId}
        page={page}
        scope={scope}
      />
    </Suspense>
  );
}
