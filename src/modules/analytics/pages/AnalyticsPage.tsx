import { getTranslations } from "next-intl/server";
import { AccountsBalanceTimelineWidget } from "@/modules/analytics/ui/AccountsBalanceTimelineWidget";

export async function AnalyticsPage() {
  const t = await getTranslations("dashboard");

  return (
    <section>
      <div className="mb-4">
        <h1 className="text-lg font-semibold">{t("analyticsTitle")}</h1>
        <p className="text-sm text-slate-500">{t("analyticsDescription")}</p>
      </div>

      <AccountsBalanceTimelineWidget />
    </section>
  );
}
