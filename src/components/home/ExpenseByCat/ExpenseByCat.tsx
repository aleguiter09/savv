import { Card } from "@tremor/react";
import { Suspense } from "react";
import ExpenseByCatSkeleton from "./ExpenseByCatSkeleton";
import ExpenseByCatChart from "./ExpenseByCatChart";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function ExpenseByCat({
  account,
  year,
  month,
}: Readonly<{ account: number; year: number; month: number }>) {
  const t = await getTranslations("home");

  return (
    <Card className="mb-4 pl-4 pr-3 py-2 shadow-md flex flex-col gap-2">
      <Link href={`/expenses?account=${account}`} className="font-semibold">
        {t("expensesByCat")}
      </Link>
      <Suspense
        key={account + year + month}
        fallback={<ExpenseByCatSkeleton />}
      >
        <ExpenseByCatChart account={account} year={year} month={month} />
      </Suspense>
    </Card>
  );
}
