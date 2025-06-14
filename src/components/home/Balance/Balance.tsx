import { Suspense } from "react";
import BalanceInfo from "./BalanceInfo";
import BalanceSkeleton from "./BalanceSkeleton";
import { Card } from "@/components/ui/card";

export default async function Balance({
  account,
}: Readonly<{
  account: number;
}>) {
  return (
    <Card className="mb-4 px-3 py-2 border-b-4 border-b-blue-600">
      <Suspense key={account} fallback={<BalanceSkeleton />}>
        <BalanceInfo account={account} />
      </Suspense>
    </Card>
  );
}
