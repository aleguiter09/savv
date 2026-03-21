import { getLocale, getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";
import { getAccountsBalanceTimeline } from "@/modules/analytics/services/analytics";
import { AccountsBalanceTimelineChart } from "@/modules/analytics/ui/AccountsBalanceTimelineChart";

export async function AccountsBalanceTimelineWidget() {
  const [t, locale, timeline] = await Promise.all([
    getTranslations("dashboard"),
    getLocale(),
    getAccountsBalanceTimeline(),
  ]);

  if (timeline.data.length === 0 || timeline.categories.length === 0) {
    return (
      <Card className="mb-4 px-4 py-3">
        <p className="font-semibold mb-2">{t("accountsBalanceTimeline")}</p>
        <p className="text-sm text-slate-500">{t("noBalanceTimelineData")}</p>
      </Card>
    );
  }

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const chartData = timeline.data.map((point) => ({
    ...point,
    date: dateFormatter.format(new Date(`${point.date}T00:00:00`)),
  }));

  return (
    <Card className="mb-4 px-4 py-3">
      <p className="font-semibold mb-3">{t("accountsBalanceTimeline")}</p>
      <AccountsBalanceTimelineChart
        locale={locale}
        data={chartData}
        categories={timeline.categories}
      />
    </Card>
  );
}
