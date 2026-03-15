import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";
import { cn } from "@/modules/shared/utils/cn";
import { getFormatter, getTranslations } from "next-intl/server";
import Link from "next/link";
import type { MovementView } from "../../types/types";

export async function MovementDetail({
  id,
  doneAt,
  amount,
  description,
  type,
  category,
  account,
}: MovementView) {
  const [tMovements, tCategories, format] = await Promise.all([
    getTranslations("movements"),
    getTranslations("categories"),
    getFormatter(),
  ]);

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
    <div className="rounded-md p-4 border bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3 items-center">
          <CategoryIcon icon={icon} color={color} />
          <span className="font-medium">
            {isGlobal && !isCustomName ? tCategories(title) : title}
          </span>
        </div>

        <span
          className={cn("text-lg font-medium", {
            "text-green-500": type === "income",
            "text-red-500": type === "expense",
          })}
        >
          {displayAmount}
        </span>
      </div>
      <div className="rounded-md border py-2 px-3 flex flex-col gap-1 mb-3">
        <dt className=" text-gray-500 text-xs">{tMovements("account")}</dt>
        <dd className="text-sm">{account.name}</dd>
      </div>

      <div className="rounded-md border py-2 px-3 flex flex-col gap-1 mb-3">
        <dt className="text-gray-500 text-xs">{tMovements("doneAt")}</dt>
        <dd className="text-sm">{displayDate}</dd>
      </div>
      <div className="rounded-md border py-2 px-3 flex flex-col gap-1">
        <dt className=" text-gray-500 text-xs">{tMovements("description")}</dt>
        <dd className="text-sm">{description}</dd>
      </div>

      <div className="mt-3 flex gap-2">
        <Link
          href={`/movements/${id}/edit`}
          className="w-full text-center rounded-md bg-blue-600 py-2 text-sm font-medium text-white"
        >
          {tMovements("edit")}
        </Link>
      </div>
    </div>
  );
}
