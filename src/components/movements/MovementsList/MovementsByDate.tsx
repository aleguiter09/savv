import FinancesSkeleton from "@/components/home/Finances/FinancesSkeleton";
import { Card } from "@tremor/react";
import { Suspense } from "react";
import MovementsList from "./MovementsList";

export default async function MovementsByDate() {
  return (
    <Card decoration="bottom" className="mb-4 px-3 py-2">
      <Suspense fallback={<FinancesSkeleton />}>
        <MovementsList />
      </Suspense>
    </Card>
  );
}
