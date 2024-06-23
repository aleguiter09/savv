import FinancesSkeleton from "@/components/home/LastMovements/LastMovementsSkeleton";
import { Card } from "@tremor/react";
import { Suspense } from "react";
import MovementsList from "./MovementsList";

export default async function MovementsByDate({
  year,
  month,
  page,
}: Readonly<{ year: number; month: number; page: number }>) {
  return (
    <Card decoration="bottom" className="mb-4 px-3 py-2">
      <Suspense key={page + month + year} fallback={<FinancesSkeleton />}>
        <MovementsList year={year} month={month} page={page} />
      </Suspense>
    </Card>
  );
}
