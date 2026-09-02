import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";
import { getBalanceTimeline } from "@/modules/analytics/services/analytics";
import type { AnalyticsFiltersParams } from "../types/analytics-filters.types";
import { accountFilterToRpc } from "../utils/accountFilterToRpc";
import { deriveTimelineBucket } from "../utils/deriveTimelineBucket";
import { balanceTimelineAdapter } from "../adapters/balanceTimelineAdapter";
import { BalanceTimelineChart } from "./BalanceTimelineChart";

export async function BalanceTimeline({
  from,
  to,
  accountId,
}: Readonly<AnalyticsFiltersParams>) {
  const bucket = deriveTimelineBucket(from, to);

  const [t, timeline] = await Promise.all([
    getTranslations("dashboard"),
    getBalanceTimeline({
      from: from.toISOString(),
      to: to.toISOString(),
      bucket,
      account_filter: accountFilterToRpc(accountId),
    }),
  ]);

  const balanceLabel = t("balance");
  const data = balanceTimelineAdapter(timeline, bucket);

  return (
    <Card className="py-3">
      <p className="pl-4 font-semibold mb-4">{t("accountsBalanceTimeline")}</p>

      <BalanceTimelineChart data={data} balanceLabel={balanceLabel} />
    </Card>
  );
}
