import { format } from "date-fns";
import { getLocale, getTranslations } from "next-intl/server";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";
import { getDateFnsLocale } from "@/modules/shared/utils/dateFnsLocale";
import { Card } from "@/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { getMonthlyCashflow } from "../services/analytics";
import type { AnalyticsAccountFilter } from "../types/analytics-filters.types";

function formatDifference(
  locale: string,
  difference: number,
  differencePercent: number | null,
) {
  const amount = formatCurrency(locale, difference, 0);
  if (differencePercent === null) {
    return amount;
  }

  return `${amount} (${differencePercent.toFixed(0)}%)`;
}

function differenceClassName(difference: number) {
  if (difference > 0) return "text-green-600";
  if (difference < 0) return "text-red-600";
  return "text-muted-foreground";
}

export async function MonthlyCashflowTable({
  accountId,
}: Readonly<AnalyticsAccountFilter>) {
  const [rows, t, locale] = await Promise.all([
    getMonthlyCashflow(accountId),
    getTranslations("dashboard"),
    getLocale(),
  ]);

  const dateLocale = getDateFnsLocale(locale);
  const hasData = rows.some((row) => row.income > 0 || row.expenses > 0);

  if (!hasData) return null;

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-4">
        {t("monthlyCashflowTitle")}
      </h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">{t("month")}</TableHead>
            <TableHead className="text-right text-xs">
              {t("incomes")}
            </TableHead>
            <TableHead className="text-right text-xs">
              {t("expenses")}
            </TableHead>
            <TableHead className="text-right text-xs">
              {t("difference")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.monthKey}>
              <TableCell className="text-xs font-medium capitalize">
                {format(row.monthStart, "MMM yyyy", { locale: dateLocale })}
              </TableCell>
              <TableCell className="text-right text-xs text-nowrap">
                {formatCurrency(locale, row.income, 0)}
              </TableCell>
              <TableCell className="text-right text-xs text-nowrap">
                {formatCurrency(locale, row.expenses, 0)}
              </TableCell>
              <TableCell
                className={`text-right text-xs text-nowrap font-medium ${differenceClassName(row.difference)}`}
              >
                {formatDifference(
                  locale,
                  row.difference,
                  row.differencePercent,
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
