import FinancesSkeleton from "@/components/home/LastMovements/LastMovementsSkeleton";
import { Card } from "@tremor/react";
import { Suspense } from "react";
import MovementsList from "./MovementsList";

export default async function MovementsByDate({
  year,
  month,
}: Readonly<{ year: number; month: number }>) {
  return (
    <Card decoration="bottom" className="mb-4 px-3 py-2">
      <Suspense fallback={<FinancesSkeleton />}>
        <MovementsList year={year} month={month} />
      </Suspense>
    </Card>
  );
}
