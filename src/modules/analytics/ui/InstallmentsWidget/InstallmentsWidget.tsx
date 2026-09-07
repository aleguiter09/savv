import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";
import {
  InstallmentsList,
  InstallmentsListSkeleton,
} from "./InstallmentsList";

type Props = Readonly<{
  accountId: string;
}>;

export async function InstallmentsWidget({ accountId }: Props) {
  const t = await getTranslations("dashboard");

  return (
    <Card className="flex flex-1 flex-col gap-3 p-4">
      <div>
        <h3 className="text-sm font-semibold">{t("installmentsTitle")}</h3>
        <p className="text-xs text-slate-500">{t("installmentsDescription")}</p>
      </div>
      <Suspense key={accountId} fallback={<InstallmentsListSkeleton />}>
        <InstallmentsList accountId={accountId} />
      </Suspense>
    </Card>
  );
}
