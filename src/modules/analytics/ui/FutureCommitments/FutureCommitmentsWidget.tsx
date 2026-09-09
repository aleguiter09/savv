import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";
import {
  FutureCommitmentsContent,
  FutureCommitmentsSkeleton,
} from "./FutureCommitmentsContent";

type Props = Readonly<{
  accountId: string;
}>;

export async function FutureCommitmentsWidget({ accountId }: Props) {
  const t = await getTranslations("dashboard");

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div>
        <h3 className="text-sm font-semibold">{t("commitmentsTitle")}</h3>
        <p className="text-xs text-slate-500">{t("commitmentsDescription")}</p>
      </div>
      <Suspense key={accountId} fallback={<FutureCommitmentsSkeleton />}>
        <FutureCommitmentsContent accountId={accountId} />
      </Suspense>
    </Card>
  );
}
