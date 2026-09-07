import Link from "next/link";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { getCategoryLabel } from "@/modules/categories/utils/getCategoryLabel";
import { getActiveSeriesSummaries } from "@/modules/movements/services/movement-series";
import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";
import { Badge } from "@/ui/badge";

type Props = Readonly<{
  accountId: string;
}>;

export async function InstallmentsList({ accountId }: Props) {
  const [items, tDashboard, tMovements, tCategories, formatter, locale] =
    await Promise.all([
      getActiveSeriesSummaries("installment", accountId),
      getTranslations("dashboard"),
      getTranslations("movements"),
      getTranslations("categories"),
      getFormatter(),
      getLocale(),
    ]);

  if (items.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-slate-500">
        {tDashboard("noInstallments")}
      </p>
    );
  }

  const totalRemaining = items.reduce(
    (sum, item) => sum + item.remainingAmount,
    0,
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm">
        <span className="text-slate-600">{tDashboard("installmentsRemaining")}</span>
        <span className="font-semibold text-red-500">
          {formatCurrency(locale, -totalRemaining, 2)}
        </span>
      </div>

      <ul className="flex flex-col gap-3">
        {items.map((item) => {
          const progress =
            item.installmentCount && item.installmentCount > 0
              ? Math.min(100, (item.paidCount / item.installmentCount) * 100)
              : 0;
          const href = item.nextPending
            ? `/movements/${item.nextPending.id}`
            : "/movements?scope=upcoming";

          return (
            <li key={item.id}>
              <Link
                href={href}
                className="block rounded-md border border-slate-200 px-3 py-2.5 hover:bg-slate-50"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
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
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-red-500">
                      {formatCurrency(locale, -item.remainingAmount, 2)}
                    </p>
                    {item.nextPending?.installmentIndex &&
                    item.installmentCount ? (
                      <Badge variant="outline" className="mt-1">
                        {tMovements("installmentBadge", {
                          current: item.nextPending.installmentIndex,
                          total: item.installmentCount,
                        })}
                      </Badge>
                    ) : null}
                  </div>
                </div>

                <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-800"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {tMovements("installmentProgress", {
                      paid: item.paidCount,
                      total: item.installmentCount ?? 0,
                    })}
                  </span>
                  {item.nextPending ? (
                    <span>
                      {tDashboard("nextPayment")}:{" "}
                      {formatter.dateTime(new Date(item.nextPending.doneAt), {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  ) : null}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function InstallmentsListSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-3">
      <div className="h-10 rounded-md bg-slate-200" />
      <div className="h-24 rounded-md bg-slate-200" />
      <div className="h-24 rounded-md bg-slate-200" />
    </div>
  );
}
