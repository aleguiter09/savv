import { Suspense } from "react";
import { MovementsList } from "./MovementsList";
import { MovementsListSkeleton } from "./MovementsListSkeleton";

type Props = Readonly<{
  from: Date;
  to: Date;
  accountId: string;
  categoryId: string;
  page: number;
}>;

export async function MovementsByDate({
  from,
  to,
  accountId,
  categoryId,
  page,
}: Props) {
  return (
    <Suspense
      key={`${from.getTime()}-${to.getTime()}-${accountId}-${categoryId}-${page}`}
      fallback={<MovementsListSkeleton />}
    >
      <MovementsList
        from={from}
        to={to}
        accountId={accountId}
        categoryId={categoryId}
        page={page}
      />
    </Suspense>
  );
}
