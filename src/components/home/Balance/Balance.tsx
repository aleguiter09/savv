import { BalanceProps } from "@/types/components";
import { Card } from "@tremor/react";
import BalanceInfo from "./BalanceInfo";
import { Suspense } from "react";
import BalanceSkeleton from "./BalanceSkeleton";

export default async function Balance({ account }: Readonly<BalanceProps>) {
  return (
    <Card decoration="bottom" className="mb-4 px-3 py-2">
      <Suspense key={account} fallback={<BalanceSkeleton />}>
        <BalanceInfo account={account} />
      </Suspense>
    </Card>
  );
}
