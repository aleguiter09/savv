import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";
import {
  BudgetWidgetContent,
  BudgetWidgetSkeleton,
} from "./BudgetWidgetContent";

type Props = Readonly<{
  accountId: string;
}>;

export async function BudgetWidget({ accountId }: Props) {
  const t = await getTranslations("dashboard");

  return (
    <Card className="mb-4 pl-4 pr-3 py-2 flex flex-col gap-2">
      <Link href="/settings/budgets" className="font-semibold">
        {t("budgets")}
      </Link>
      <Suspense key={accountId} fallback={<BudgetWidgetSkeleton />}>
        <BudgetWidgetContent accountId={accountId} />
      </Suspense>
    </Card>
  );
}
