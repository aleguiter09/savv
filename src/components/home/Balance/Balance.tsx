import { Card } from "@tremor/react";
import { Suspense } from "react";
import BalanceInfo from "./BalanceInfo";
import BalanceSkeleton from "./BalanceSkeleton";

export default async function Balance({
  account,
}: Readonly<{
  account: number;
}>) {
  return (
    <Card decoration="bottom" className="mb-4 px-3 py-2">
      <Suspense key={account} fallback={<BalanceSkeleton />}>
        <BalanceInfo account={account} />
      </Suspense>
    </Card>
  );
}
