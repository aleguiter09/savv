import { Card, Divider } from "@tremor/react";
import Link from "next/link";
import { Suspense } from "react";
import FinancesSkeleton from "./FinancesSkeleton";
import LastMovementsList from "./LastMovementsList";

export default async function Finances() {
  return (
    <Card decoration="bottom" className="mb-4 px-3 py-2">
      <p className="font-semibold ml-2">Last Movements</p>
      <Divider className="mt-2 mb-1 mx-1" />
      <Suspense fallback={<FinancesSkeleton />}>
        <LastMovementsList />
      </Suspense>
      <Link href="/movements">
        <p className="text-blue-500 font-semibold text-center pb-1 pt-3">
          See all
        </p>
      </Link>
    </Card>
  );
}
