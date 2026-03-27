import { getLocale, getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";
import { getBalanceTimeline } from "@/modules/analytics/services/analytics";
import { BalanceTimelineChart } from "./BalanceTimelineChart";
import { balanceTimelineAdapter } from "../adapters/balanceTimelineAdapter";

export async function BalanceTimeline() {
  const [t, locale, timeline] = await Promise.all([
    getTranslations("dashboard"),
    getLocale(),
    getBalanceTimeline({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      to: new Date().toISOString(),
      bucket: "day",
    }),
  ]);

  const data = balanceTimelineAdapter(timeline, "day");

  return (
    <Card className="mb-4 px-4 py-3">
      <p className="font-semibold mb-3">{t("accountsBalanceTimeline")}</p>

      <BalanceTimelineChart data={data} />
    </Card>
  );
}
