import { Card } from "@/ui/card";
import { getCategoryAverages } from "../services/analytics";
import { Badge } from "@/ui/badge";

type CategoryData = {
  category_id: number;
  category_name: string;
  monthly_avg: number;
  current_month_total: number;
  delta_percent: number;
};

function getColor(delta: number) {
  if (delta > 20) return "destructive";
  if (delta > 5) return "info";
  if (delta < -10) return "success";
  return "secondary";
}

function formatCurrency(value: number) {
  return `€ ${value.toFixed(0)}`;
}

function formatDelta(delta: number) {
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(0)}%`;
}

export async function CategoryAverageWidget() {
  const data = await getCategoryAverages();

  if (!data) return null;

  const sorted = [...(data as CategoryData[])].sort(
    (a, b) => b.delta_percent - a.delta_percent,
  );

  const top = sorted[0];

  return (
    <Card className="px-3 mb-4 py-2 border-b-4 border-b-blue-500">
      <p className="text-xs font-semibold text-gray-600">
        {"Expenses vs Average".toUpperCase()}
      </p>

      {top && (
        <p className="mt-2">
          Estás gastando <strong>{formatDelta(top.delta_percent)}</strong> en{" "}
          <strong>{top.category_name}</strong> este mes
        </p>
      )}

      <div className="mt-6 space-y-3">
        {sorted.slice(0, 15).map((item) => (
          <div key={item.category_id} className="flex justify-between">
            <div>
              <p className="font-medium">{item.category_name}</p>
              <p className="text-xs text-gray-500">
                {formatCurrency(Math.abs(item.current_month_total))} vs{" "}
                {formatCurrency(Math.abs(item.monthly_avg))}
              </p>
            </div>

            <Badge
              className={`px-2 py-1 text-xs font-bold`}
              variant={getColor(item.delta_percent)}
            >
              {formatDelta(item.delta_percent)}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
