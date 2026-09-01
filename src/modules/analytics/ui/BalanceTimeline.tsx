import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";
import { getBalanceTimeline } from "@/modules/analytics/services/analytics";
import { BalanceTimelineChart } from "./BalanceTimelineChart";
import { balanceTimelineAdapter } from "../adapters/balanceTimelineAdapter";

export async function BalanceTimeline() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [t, timeline] = await Promise.all([
    getTranslations("dashboard"),
    getBalanceTimeline({
      from: thirtyDaysAgo.toISOString(),
      to: now.toISOString(),
      bucket: "day",
    }),
  ]);

  const balanceLabel = t("balance");
  const data = balanceTimelineAdapter(timeline, "day");

  return (
    <Card className="py-3">
      <p className="pl-4 font-semibold mb-4">{t("accountsBalanceTimeline")}</p>

      <BalanceTimelineChart data={data} balanceLabel={balanceLabel} />
    </Card>
  );
}
