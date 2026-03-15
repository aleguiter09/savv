import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";
import { MovementView } from "@/modules/movements/types/types";

export async function LastMovementDetail({
  id,
  doneAt,
  amount,
  description,
  type,
  category,
}: MovementView) {
  const [t, format] = await Promise.all([
    getTranslations("categories"),
    getFormatter(),
  ]);
  const isExpense = type === "expense";
  const isIncome = type === "income";

  const auxColor = isIncome ? "text-green-500" : "text-gray-500";
  const priceColor = isExpense ? "text-red-500" : auxColor;

  const { icon, color, isGlobal, isCustomName, title } = category;

  const displayAmount = format.number(type === "expense" ? -amount : amount, {
    style: "currency",
    currency: "EUR",
    signDisplay: "auto",
  });

  const displayDate = format.dateTime(new Date(doneAt), {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      tabIndex={0}
      href={`/movements/${id}`}
      className="flex items-center justify-between px-1 pb-2 border-b border-gray-300 last:border-b-0 focus:ring-2 focus:ring-inset focus:ring-blue-600"
    >
      <div className="flex items-center gap-3">
        <CategoryIcon icon={icon} color={color} />
        <div className="flex flex-col">
          <span className="font-medium text-sm">{description}</span>
          <span className="text-xs text-gray-500">
            {isGlobal && !isCustomName ? t(title) : title}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1 text-right">
        <span className={`font-medium ${priceColor}`}>{displayAmount}</span>
        <span className="text-xs text-gray-500">{displayDate}</span>
      </div>
    </Link>
  );
}
