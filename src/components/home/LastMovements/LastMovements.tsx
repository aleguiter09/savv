import { Card } from "@tremor/react";
import Link from "next/link";
import { Suspense } from "react";
import LastMovementsSkeleton from "./LastMovementsSkeleton";
import LastMovementsList from "./LastMovementsList";
import { getTranslations } from "next-intl/server";

export default async function LastMovements({
  account,
}: Readonly<{ account: number }>) {
  const t = await getTranslations("home");

  return (
    <Card className="shadow-sm mb-4 pl-4 pr-3 py-2">
      <p className="font-semibold mb-2">{t("lastMovements")}</p>
      <Suspense key={account} fallback={<LastMovementsSkeleton />}>
        <LastMovementsList account={account} />
      </Suspense>
      <Link href="/movements">
        <p className="text-blue-500 font-semibold text-center mb-1 mt-3">
          {t("seeAll")}
        </p>
      </Link>
    </Card>
  );
}
