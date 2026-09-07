import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { getCategoryLabel } from "@/modules/categories/utils/getCategoryLabel";
import { getActiveSeriesSummaries } from "@/modules/movements/services/movement-series";
import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";
import { Badge } from "@/ui/badge";
import { RecurringSeriesActions } from "./RecurringSeriesActions";

type Props = Readonly<{
  accountId: string;
}>;

const frequencyKey = {
  weekly: "freqWeekly",
  biweekly: "freqBiweekly",
  monthly: "freqMonthly",
  yearly: "freqYearly",
} as const;

export async function RecurringPaymentsList({ accountId }: Props) {
  const [items, tDashboard, tMovements, tCategories, formatter, locale] =
    await Promise.all([
      getActiveSeriesSummaries("recurring", accountId),
      getTranslations("dashboard"),
      getTranslations("movements"),
      getTranslations("categories"),
      getFormatter(),
      getLocale(),
    ]);

  if (items.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-slate-500">
        {tDashboard("noRecurring")}
      </p>
    );
  }

  const monthlyEstimate = items.reduce((sum, item) => {
    const amount = item.nextPending?.amount ?? item.amount;
    switch (item.frequency) {
      case "weekly":
        return sum + amount * (52 / 12);
      case "biweekly":
        return sum + amount * (26 / 12);
      case "yearly":
        return sum + amount / 12;
      default:
        return sum + amount;
    }
  }, 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm">
        <span className="text-slate-600">{tDashboard("recurringMonthlyEstimate")}</span>
        <span className="font-semibold text-red-500">
          {formatCurrency(locale, -monthlyEstimate, 2)}
        </span>
      </div>

      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-md border border-slate-200 px-3 py-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <CategoryIcon
                  icon={item.category.icon}
                  color={item.category.color}
                  size={14}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {item.description}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {getCategoryLabel(
                      item.category.title,
                      item.category.isGlobal,
                      item.category.isCustomName,
                      tCategories,
                    )}
                    {item.accountName ? ` · ${item.accountName}` : ""}
                  </p>
                </div>
              </div>
              <p className="shrink-0 text-sm font-medium text-red-500">
                {formatCurrency(
                  locale,
                  -(item.nextPending?.amount ?? item.amount),
                  2,
                )}
              </p>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {tMovements(frequencyKey[item.frequency])}
              </Badge>
              {item.nextPending ? (
                <span className="text-xs text-slate-500">
                  {tDashboard("nextPayment")}:{" "}
                  {formatter.dateTime(new Date(item.nextPending.doneAt), {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              ) : null}
              {item.endDate ? (
                <span className="text-xs text-slate-500">
                  {tDashboard("endsOn")}:{" "}
                  {formatter.dateTime(new Date(`${item.endDate}T12:00:00.000Z`), {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              ) : null}
            </div>

            <RecurringSeriesActions
              seriesId={item.id}
              description={item.description}
              nextMovementId={item.nextPending?.id ?? null}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RecurringPaymentsListSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-3">
      <div className="h-10 rounded-md bg-slate-200" />
      <div className="h-28 rounded-md bg-slate-200" />
      <div className="h-28 rounded-md bg-slate-200" />
    </div>
  );
}
