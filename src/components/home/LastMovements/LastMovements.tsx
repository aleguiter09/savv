import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { LastMovementsList, LastMovementsSkeleton } from "./LastMovementsList";

export default async function LastMovements({
  account,
}: Readonly<{ account: number }>) {
  const t = await getTranslations("home");

  return (
    <Card className="shadow-md mb-4 pl-4 pr-3 py-2">
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
