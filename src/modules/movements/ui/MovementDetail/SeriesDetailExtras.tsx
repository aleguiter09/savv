import Link from "next/link";
import { Badge } from "@/ui/badge";
import { cn } from "@/modules/shared/utils/cn";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";
import { getFormatter, getTranslations } from "next-intl/server";
import type { SeriesDetailContext } from "../../services/movement-series";

type SeriesDetailExtrasProps = {
  series: SeriesDetailContext;
  currentMovementId: number;
  locale: string;
};

const frequencyKey = {
  weekly: "freqWeekly",
  biweekly: "freqBiweekly",
  monthly: "freqMonthly",
  yearly: "freqYearly",
} as const;

export async function SeriesDetailExtras({
  series,
  currentMovementId,
  locale,
}: Readonly<SeriesDetailExtrasProps>) {
  const [t, formatter] = await Promise.all([
    getTranslations("movements"),
    getFormatter(),
  ]);

  const appliedCount = series.occurrences.filter((o) => o.applied).length;
  const nextPending = series.occurrences.find((o) => !o.applied);
  const current = series.occurrences.find((o) => o.id === currentMovementId);

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {series.kind === "recurring" ? (
          <>
            <Badge variant="secondary">{t("scheduleRecurring")}</Badge>
            <Badge variant="outline">{t(frequencyKey[series.frequency])}</Badge>
          </>
        ) : (
          <>
            <Badge variant="secondary">{t("scheduleInstallment")}</Badge>
            {current?.installmentIndex && series.installmentCount ? (
              <Badge variant="outline">
                {t("installmentBadge", {
                  current: current.installmentIndex,
                  total: series.installmentCount,
                })}
              </Badge>
            ) : null}
          </>
        )}
        {current && !current.applied ? (
          <Badge variant="info">{t("statusPending")}</Badge>
        ) : null}
        {series.status === "completed" ? (
          <Badge variant="success">{t("seriesCompleted")}</Badge>
        ) : null}
      </div>

      {series.kind === "recurring" && nextPending ? (
        <div className="rounded-md border py-2 px-3 flex flex-col gap-1">
          <dt className="text-gray-500 text-xs">{t("nextOccurrence")}</dt>
          <dd className="text-sm">
            {formatter.dateTime(new Date(nextPending.doneAt), {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" · "}
            {formatCurrency(locale, -nextPending.amount, 2)}
          </dd>
        </div>
      ) : null}

      {series.kind === "installment" && series.installmentCount ? (
        <div className="rounded-md border p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h5 className="text-sm font-medium">{t("installmentPlanTitle")}</h5>
            <span className="text-muted-foreground text-xs">
              {t("installmentProgress", {
                paid: appliedCount,
                total: series.installmentCount,
              })}
            </span>
          </div>

          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gray-800"
              style={{
                width: `${Math.min(
                  100,
                  (appliedCount / series.installmentCount) * 100,
                )}%`,
              }}
            />
          </div>

          <ul className="flex flex-col gap-1">
            {series.occurrences.map((occurrence) => {
              const isCurrent = occurrence.id === currentMovementId;
              const row = (
                <div
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-md px-2 py-2 text-sm",
                    isCurrent && "bg-gray-50 ring-1 ring-gray-200",
                  )}
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="font-medium">
                      {t("installmentBadge", {
                        current: occurrence.installmentIndex ?? "–",
                        total: series.installmentCount ?? "–",
                      })}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {formatter.dateTime(new Date(occurrence.doneAt), {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span className="text-red-500">
                      {formatCurrency(locale, -occurrence.amount, 2)}
                    </span>
                    <span
                      className={cn(
                        "text-xs",
                        occurrence.applied
                          ? "text-green-600"
                          : "text-amber-600",
                      )}
                    >
                      {occurrence.applied
                        ? t("statusPaid")
                        : t("statusPending")}
                    </span>
                  </div>
                </div>
              );

              if (isCurrent) {
                return <li key={occurrence.id}>{row}</li>;
              }

              return (
                <li key={occurrence.id}>
                  <Link
                    href={`/movements/${occurrence.id}`}
                    className="block rounded-md hover:bg-gray-50"
                  >
                    {row}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
