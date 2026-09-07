import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";
import {
  RecurringPaymentsList,
  RecurringPaymentsListSkeleton,
} from "./RecurringPaymentsList";

type Props = Readonly<{
  accountId: string;
}>;

export async function RecurringPaymentsWidget({ accountId }: Props) {
  const t = await getTranslations("dashboard");

  return (
    <Card className="flex flex-1 flex-col gap-3 p-4">
      <div>
        <h3 className="text-sm font-semibold">{t("recurringTitle")}</h3>
        <p className="text-xs text-slate-500">{t("recurringDescription")}</p>
      </div>
      <Suspense key={accountId} fallback={<RecurringPaymentsListSkeleton />}>
        <RecurringPaymentsList accountId={accountId} />
      </Suspense>
    </Card>
  );
}
