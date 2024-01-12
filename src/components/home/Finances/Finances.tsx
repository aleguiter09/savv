import { Card } from "@tremor/react";
import Link from "next/link";
import { Suspense } from "react";
import FinancesSkeleton from "./FinancesSkeleton";
import LastMovementsList from "./LastMovementsList";

export default async function Finances({
  account,
}: Readonly<{ account: number }>) {
  return (
    <Card decoration="bottom" className="mb-4 pl-4 pr-3 py-2">
      <p className="font-semibold mb-2">Last Movements</p>
      <Suspense key={account} fallback={<FinancesSkeleton />}>
        <LastMovementsList account={account} />
      </Suspense>
      <Link href="/movements">
        <p className="text-blue-500 font-semibold text-center pb-1 pt-3">
          See all
        </p>
      </Link>
    </Card>
  );
}
