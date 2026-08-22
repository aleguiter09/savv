import { Card } from "@/ui/card";
import { getCategoryComparison } from "../services/analytics";
import { Badge } from "@/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";
import { getCategoryLabel } from "@/modules/budgets/ui/BudgetWidgetContent";
import { getTranslations } from "next-intl/server";

type CategoryComparisonData = {
  category_id: number;
  category_title: string;
  category_icon: string;
  category_color: string;
  current_month_spent: number;
  six_month_avg: number;
  budget_amount: number;
  diff_vs_avg_percent: number;
  diff_vs_budget_percent: number | null;
};

function formatCurrency(value: number) {
  if (!value) return "-";
  return `€${value.toFixed(0)}`;
}

function formatPercent(value: number | null) {
  if (value === null) return "-";
  return `${value.toFixed(0)}%`;
}

function getAvgColor(delta: number) {
  if (delta > 20) return "destructive";
  if (delta > 5) return "info";
  if (delta < -10) return "success";
  return "secondary";
}

export async function CategoryComparisonTable({
  accountId,
}: {
  accountId?: string;
}) {
  const data = await getCategoryComparison(accountId);
  const t = await getTranslations();

  if (!data || data.length === 0) return null;

  const sorted = [...data].sort(
    (a, b) => b.current_month_spent - a.current_month_spent,
  );

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-4">
        {t("categories.analytics.title")}
      </h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">
              {t("categories.analytics.category")}
            </TableHead>
            <TableHead className="text-right text-xs">
              {t("categories.analytics.thisMonth")}
            </TableHead>
            <TableHead className="text-right text-xs">
              {t("categories.analytics.sixMonthAvg")}
            </TableHead>
            <TableHead className="text-right text-xs">
              {t("categories.analytics.difference")}
            </TableHead>
            <TableHead className="text-right text-xs">
              {t("categories.analytics.budget")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((item) => (
            <TableRow key={item.category_id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-1.5">
                  <CategoryIcon
                    icon={item.category_icon}
                    color={item.category_color}
                    size={12}
                  />
                  <span className="text-xs font-normal">
                    {getCategoryLabel(item.category_title, true, false, t)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right text-xs text-nowrap">
                {formatCurrency(item.current_month_spent)}
              </TableCell>
              <TableCell className="text-right text-xs">
                {formatCurrency(item.six_month_avg)}
              </TableCell>
              <TableCell className="text-right text-xs">
                <Badge variant={getAvgColor(item.diff_vs_avg_percent)}>
                  {formatPercent(item.diff_vs_avg_percent)}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-xs">
                {formatCurrency(item.budget_amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
