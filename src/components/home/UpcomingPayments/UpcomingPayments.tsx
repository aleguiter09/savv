import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import {
  UpcomingPaymentsList,
  UpcomingPaymentsSkeleton,
} from "./UpcomingPaymentsList";
import { AccountIds } from "@/types/general";

type Props = Readonly<{
  accountId: AccountIds;
}>;

export async function UpcomingPayments({ accountId }: Props) {
  const t = await getTranslations("home");

  return (
    <Card className="shadow-md mb-4 pl-4 pr-3 pt-2 pb-3">
      <p className="font-semibold mb-2">{t("upcomingPayments")}</p>
      <Suspense key={accountId} fallback={<UpcomingPaymentsSkeleton />}>
        <UpcomingPaymentsList accountId={accountId} />
      </Suspense>
      {/*<Link href="/movements">
        <p className="text-blue-500 font-semibold text-center mb-1 mt-3">
          {t("seeAll")}
        </p>
      </Link>*/}
    </Card>
  );
}
