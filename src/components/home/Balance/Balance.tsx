import type { AccountIds } from "@/types/general";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { BalanceInfo, BalanceSkeleton } from "./BalanceInfo";
import { getTranslations } from "next-intl/server";

type Props = Readonly<{
  accountId: AccountIds;
}>;

export async function Balance({ accountId }: Props) {
  const t = await getTranslations("common");

  return (
    <Card className="mb-4 px-3 py-2 border-b-4 border-b-blue-600">
      <Suspense key={accountId} fallback={<BalanceSkeleton loadingText={t("loading")} />}>
        <BalanceInfo accountId={accountId} />
      </Suspense>
    </Card>
  );
}
