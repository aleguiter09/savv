import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { ExpenseByCatChart, ExpenseByCatSkeleton } from "./ExpenseByCatChart";

type Props = Readonly<{
  accountId: string;
  year: number;
  month: number;
}>;

export async function ExpenseByCat({ accountId, year, month }: Props) {
  const t = await getTranslations("home");

  return (
    <Card className="mb-4 pl-4 pr-3 py-2 flex flex-col gap-2">
      <Link href={`/expenses?account=${accountId}`} className="font-semibold">
        {t("expensesByCat")}
      </Link>
      <Suspense
        key={accountId + year + month}
        fallback={<ExpenseByCatSkeleton />}
      >
        <ExpenseByCatChart accountId={accountId} year={year} month={month} />
      </Suspense>
    </Card>
  );
}
