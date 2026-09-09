import { format } from "date-fns";
import { getLocale, getTranslations } from "next-intl/server";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";
import { getDateFnsLocale } from "@/modules/shared/utils/dateFnsLocale";
import { Card } from "@/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { summarizeMonthlyCashflow } from "../adapters/monthlyCashflowAdapter";
import { getMonthlyCashflow } from "../services/analytics";
import type {
  AnalyticsAccountFilter,
  CashflowMonthsOption,
} from "../types/analytics-filters.types";
import { MonthlyCashflowMonthsSelect } from "./MonthlyCashflowMonthsSelect";

type Props = Readonly<
  AnalyticsAccountFilter & {
    months: CashflowMonthsOption;
  }
>;

function formatPercent(value: number | null) {
  if (value === null) return "—";
  return `${value.toFixed(0)}%`;
}

function savingsClassName(difference: number) {
  if (difference > 0) return "text-green-600";
  if (difference < 0) return "text-red-600";
  return "text-muted-foreground";
}

export async function MonthlyCashflowTable({ accountId, months }: Props) {
  const [rows, t, locale] = await Promise.all([
    getMonthlyCashflow(accountId, months),
    getTranslations("dashboard"),
    getLocale(),
  ]);

  const dateLocale = getDateFnsLocale(locale);
  const hasData = rows.some((row) => row.income > 0 || row.expenses > 0);
  const summary = summarizeMonthlyCashflow(rows);

  if (!hasData) return null;

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">{t("monthlyCashflowTitle")}</h3>
        <MonthlyCashflowMonthsSelect months={months} />
      </div>

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
              {t("savings")}
            </TableHead>
            <TableHead className="text-right text-xs">
              {t("savingsRate")}
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
                className={`text-right text-xs text-nowrap font-medium ${savingsClassName(row.difference)}`}
              >
                {formatCurrency(locale, row.difference, 0)}
              </TableCell>
              <TableCell
                className={`text-right text-xs text-nowrap font-medium ${savingsClassName(row.difference)}`}
              >
                {formatPercent(row.differencePercent)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableCell className="text-xs font-semibold">
              {t("average")}
            </TableCell>
            <TableCell className="text-right text-xs text-nowrap font-semibold">
              {formatCurrency(locale, summary.income, 0)}
            </TableCell>
            <TableCell className="text-right text-xs text-nowrap font-semibold">
              {formatCurrency(locale, summary.expenses, 0)}
            </TableCell>
            <TableCell
              className={`text-right text-xs text-nowrap font-semibold ${savingsClassName(summary.difference)}`}
            >
              {formatCurrency(locale, summary.difference, 0)}
            </TableCell>
            <TableCell
              className={`text-right text-xs text-nowrap font-semibold ${savingsClassName(summary.difference)}`}
            >
              {formatPercent(summary.differencePercent)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
}
