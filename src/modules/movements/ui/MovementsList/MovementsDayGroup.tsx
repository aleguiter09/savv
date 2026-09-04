import { getFormatter, getLocale } from "next-intl/server";
import { cn } from "@/modules/shared/utils/cn";
import { Card } from "@/ui/card";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";
import { MovementRow } from "./MovementRow";
import type { MovementView } from "../../types/types";

export type MovementsDayGroupProps = {
  date: string;
  amount: number;
  items: MovementView[];
};

export async function MovementsDayGroup({
  date,
  items = [],
  amount,
}: Readonly<MovementsDayGroupProps>) {
  const [format, locale] = await Promise.all([getFormatter(), getLocale()]);

  const displayTotal = formatCurrency(locale, amount, 2);

  return (
    <Card className="mb-4 px-3 py-2 border-b-4 border-b-blue-600">
      <div className="flex items-center justify-between px-2 pb-2 pt-1">
        <h2 className="text-xs font-medium text-gray-900">
          {format.dateTime(new Date(date), {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </h2>
        <span
          className={cn(
            "text-xs font-semibold",
            amount > 0 && "text-green-600",
            amount < 0 && "text-red-600",
            amount === 0 && "text-muted-foreground",
          )}
        >
          {displayTotal}
        </span>
      </div>
      <div className="flex flex-col">
        {items.map((item) => (
          <MovementRow {...item} key={item.id} />
        ))}
      </div>
    </Card>
  );
}
