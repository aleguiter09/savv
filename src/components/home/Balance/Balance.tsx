import type { AccountIds } from "@/types/general";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { BalanceInfo, BalanceSkeleton } from "./BalanceInfo";

type Props = Readonly<{
  accountId: AccountIds;
}>;

export async function Balance({ accountId }: Props) {
  return (
    <Card className="mb-4 px-3 py-2 border-b-4 border-b-blue-600">
      <Suspense key={accountId} fallback={<BalanceSkeleton />}>
        <BalanceInfo accountId={accountId} />
      </Suspense>
    </Card>
  );
}
