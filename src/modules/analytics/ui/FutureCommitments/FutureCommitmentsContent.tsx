import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { getCategoryLabel } from "@/modules/categories/utils/getCategoryLabel";
import { adaptMovementItem } from "@/modules/movements/adapters/movements.adapter";
import {
  getActiveSeriesSummaries,
  type SeriesSummary,
} from "@/modules/movements/services/movement-series";
import { getUpcomingMovements } from "@/modules/movements/services/movements";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";
import {
  FutureCommitmentsTabs,
  type CommitmentRow,
  type CommitmentsTabData,
} from "./FutureCommitmentsTabs";

type Props = Readonly<{
  accountId: string;
}>;

const frequencyKey = {
  weekly: "freqWeekly",
  biweekly: "freqBiweekly",
  monthly: "freqMonthly",
  yearly: "freqYearly",
} as const;

function monthlyEstimate(items: SeriesSummary[]) {
  return items.reduce((sum, item) => {
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
}

function formatShortDate(
  formatter: Awaited<ReturnType<typeof getFormatter>>,
  value: string,
) {
  return formatter.dateTime(new Date(value), {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function FutureCommitmentsContent({ accountId }: Props) {
  const [
    installments,
    recurring,
    upcomingRaw,
    t,
    tMovements,
    tCategories,
    locale,
    formatter,
  ] = await Promise.all([
    getActiveSeriesSummaries("installment", accountId),
    getActiveSeriesSummaries("recurring", accountId),
    getUpcomingMovements(accountId, 10),
    getTranslations("dashboard"),
    getTranslations("movements"),
    getTranslations("categories"),
    getLocale(),
    getFormatter(),
  ]);

  const upcoming = upcomingRaw.map(adaptMovementItem);

  const installmentRows: CommitmentRow[] = installments.map((item) => {
    const categoryLabel = getCategoryLabel(
      item.category.title,
      item.category.isGlobal,
      item.category.isCustomName,
      tCategories,
    );
    const progress =
      item.installmentCount && item.installmentCount > 0
        ? Math.min(100, (item.paidCount / item.installmentCount) * 100)
        : 0;

    return {
      id: item.id,
      href: item.nextPending
        ? `/movements/${item.nextPending.id}`
        : "/movements?scope=upcoming",
      title: item.description,
      subtitle: [
        categoryLabel,
        item.accountName || null,
        item.nextPending?.installmentIndex && item.installmentCount
          ? tMovements("installmentBadge", {
              current: item.nextPending.installmentIndex,
              total: item.installmentCount,
            })
          : null,
      ]
        .filter(Boolean)
        .join(" · "),
      amountLabel: formatCurrency(locale, -item.remainingAmount, 2),
      meta: item.nextPending
        ? `${t("nextPayment")} · ${formatShortDate(formatter, item.nextPending.doneAt)}`
        : tMovements("installmentProgress", {
            paid: item.paidCount,
            total: item.installmentCount ?? 0,
          }),
      progress,
      icon: item.category.icon,
      color: item.category.color,
    };
  });

  const recurringRows: CommitmentRow[] = recurring.map((item) => {
    const categoryLabel = getCategoryLabel(
      item.category.title,
      item.category.isGlobal,
      item.category.isCustomName,
      tCategories,
    );

    return {
      id: item.id,
      href: item.nextPending
        ? `/movements/${item.nextPending.id}`
        : "/movements?scope=upcoming",
      title: item.description,
      subtitle: [
        categoryLabel,
        item.accountName || null,
        tMovements(frequencyKey[item.frequency]),
      ]
        .filter(Boolean)
        .join(" · "),
      amountLabel: formatCurrency(
        locale,
        -(item.nextPending?.amount ?? item.amount),
        2,
      ),
      meta: item.nextPending
        ? `${t("nextPayment")} · ${formatShortDate(formatter, item.nextPending.doneAt)}`
        : undefined,
      icon: item.category.icon,
      color: item.category.color,
    };
  });

  const upcomingRows: CommitmentRow[] = upcoming.map((item) => ({
    id: item.id,
    href: `/movements/${item.id}`,
    title: item.description,
    subtitle: getCategoryLabel(
      item.category.title,
      item.category.isGlobal,
      item.category.isCustomName,
      tCategories,
    ),
    amountLabel: formatCurrency(
      locale,
      item.type === "expense" ? -item.amount : item.amount,
      2,
    ),
    amountTone:
      item.type === "income"
        ? "income"
        : item.type === "transfer"
          ? "neutral"
          : "expense",
    meta: formatShortDate(formatter, item.doneAt),
    icon: item.category.icon,
    color: item.category.color,
  }));

  const remaining = installments.reduce(
    (sum, item) => sum + item.remainingAmount,
    0,
  );

  const tabs: CommitmentsTabData[] = [
    {
      id: "installments",
      label: t("commitmentsTabInstallments"),
      count: installments.length,
      summaryLabel: t("installmentsRemaining"),
      summaryValue: formatCurrency(locale, -remaining, 2),
      emptyLabel: t("noInstallments"),
      seeAllHref: "/movements?scope=upcoming",
      rows: installmentRows,
    },
    {
      id: "recurring",
      label: t("commitmentsTabRecurring"),
      count: recurring.length,
      summaryLabel: t("recurringMonthlyEstimate"),
      summaryValue: formatCurrency(locale, -monthlyEstimate(recurring), 2),
      emptyLabel: t("noRecurring"),
      seeAllHref: "/movements?scope=upcoming",
      rows: recurringRows,
    },
    {
      id: "upcoming",
      label: t("commitmentsTabUpcoming"),
      count: upcoming.length,
      emptyLabel: t("noUpcomingPayments"),
      seeAllHref: "/movements?scope=upcoming",
      rows: upcomingRows,
    },
  ];

  return <FutureCommitmentsTabs seeAllLabel={t("seeAll")} tabs={tabs} />;
}

export function FutureCommitmentsSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-3">
      <div className="h-9 rounded-lg bg-slate-200" />
      <div className="h-10 rounded-md bg-slate-200" />
      <div className="h-16 rounded-md bg-slate-200" />
      <div className="h-16 rounded-md bg-slate-200" />
    </div>
  );
}
