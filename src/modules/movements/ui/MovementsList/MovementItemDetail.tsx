import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";
import { cn } from "@/modules/shared/utils/cn";
import type { MovementView } from "../../types/types";

export async function MovementItemDetail({
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

  const { icon, color, isGlobal, isCustomName, title } = category;

  return (
    <Link
      tabIndex={0}
      href={`/movements/${id}`}
      className="flex items-center justify-between px-1 pb-2 border-b border-gray-300 last:border-b-0 focus:ring-2 focus:ring-inset focus:ring-blue-600"
    >
      <div className="flex gap-3">
        <CategoryIcon icon={icon} color={color} />
        <div className="flex flex-col">
          <span className="font-medium text-sm">{description}</span>
          <span className="text-xs text-gray-500">
            {isGlobal && !isCustomName ? t(title) : title}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1 text-right">
        <span
          className={cn(
            "font-medium text-sm",
            type === "expense" && "text-red-500",
            type === "income" && "text-green-500",
            type === "transfer" && "text-gray-500",
          )}
        >{`${type === "expense" ? "-" : ""} $${amount.toFixed(2)}`}</span>
        <span className="text-xs text-gray-500">
          {format.dateTime(new Date(doneAt), {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </Link>
  );
}
