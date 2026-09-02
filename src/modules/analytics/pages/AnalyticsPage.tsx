import { getTranslations } from "next-intl/server";
import { parseAnalyticsSearchParams } from "../adapters/analytics.adapter";
import type { AnalyticsPageProps } from "../types/analytics-filters.types";
import { AnalyticsFilters } from "../ui/AnalyticsFilters/AnalyticsFilters";
import { BalanceTimeline } from "../ui/BalanceTimeline";
import { CategoryComparisonTable } from "../ui/CategoryAverages";
import { NetWorth } from "../ui/NetWorth/NetWorth";

export type { AnalyticsPageProps };

export async function AnalyticsPage(props: Readonly<AnalyticsPageProps>) {
  const params = await parseAnalyticsSearchParams(props);
  const t = await getTranslations("dashboard");

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">{t("analyticsTitle")}</h1>
        <p className="text-sm text-slate-500">{t("analyticsDescription")}</p>
      </div>

      <AnalyticsFilters {...params} />

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="flex-1 flex flex-col gap-4">
          <NetWorth {...params} />
          <BalanceTimeline {...params} />
        </div>
        <div className="flex-1">
          <CategoryComparisonTable accountId={params.accountId} />
        </div>
      </div>
    </section>
  );
}
