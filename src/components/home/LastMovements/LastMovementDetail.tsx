import Link from "next/link";
import Icon from "@mdi/react";
import { Category, Movement } from "@/types/database";
import { CATEGORY_ICONS } from "@/utils/constants";
import { getFormatter, getTranslations } from "next-intl/server";

export async function LastMovementDetail({
  id,
  done_at,
  amount,
  comment,
  type,
  fullCategory,
}: Readonly<Movement>) {
  const [t, format] = await Promise.all([
    getTranslations("categories"),
    getFormatter(),
  ]);
  const isExpense = type === "expense";
  const isIncome = type === "income";

  const auxColor = isIncome ? "text-green-500" : "text-gray-500";
  const color = isExpense ? "text-red-500" : auxColor;

  return (
    <Link
      tabIndex={0}
      href={`/movements/${id}`}
      className="flex items-center justify-between px-1 pb-2 border-b border-gray-300 last:border-b-0 focus:ring-2 focus:ring-inset focus:ring-blue-600"
    >
      <div className="flex gap-3">
        <Icon
          className={`bg-${(fullCategory as Category).color} mx-auto rounded-full p-1.5`}
          path={CATEGORY_ICONS[(fullCategory as Category).icon ?? "other"]}
          size="36px"
          color="white"
        />
        <div className="flex flex-col">
          <span className="font-medium text-sm">{comment}</span>
          <span className="text-xs text-gray-500">
            {t((fullCategory as Category).title ?? "")}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1 text-right">
        <span
          className={`font-medium ${color}`}
        >{`${isExpense ? "-" : ""} $${amount.toFixed(2)}`}</span>
        <span className="text-xs text-gray-500">
          {format.dateTime(new Date(done_at), {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </Link>
  );
}
