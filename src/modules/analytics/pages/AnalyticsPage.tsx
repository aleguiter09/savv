import { getTranslations } from "next-intl/server";
import { NetWorth } from "@/modules/analytics/ui/NetWorth/NetWorth";
import { BalanceTimeline } from "../ui/BalanceTimeline";
import { CategoryComparisonTable } from "../ui/CategoryAverages";

export async function AnalyticsPage() {
  const t = await getTranslations("dashboard");

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">{t("analyticsTitle")}</h1>
        <p className="text-sm text-slate-500">{t("analyticsDescription")}</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="flex-1 flex flex-col gap-4">
          <NetWorth />
          <BalanceTimeline />
        </div>
        <div className="flex-1">
          <CategoryComparisonTable />
        </div>
      </div>
    </section>
  );
}
