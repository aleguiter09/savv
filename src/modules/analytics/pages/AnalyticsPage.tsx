import { getTranslations } from "next-intl/server";
import { NetWorth } from "@/modules/dashboard/ui/NetWorth/NetWorth";
import { BalanceTimeline } from "../ui/BalanceTimeline";

export async function AnalyticsPage() {
  const t = await getTranslations("dashboard");

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">{t("analyticsTitle")}</h1>
        <p className="text-sm text-slate-500">{t("analyticsDescription")}</p>
      </div>

      <NetWorth />
      <BalanceTimeline />
    </section>
  );
}
