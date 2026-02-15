import { MovementTypes } from "@/modules/shared/types/global.types";
import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";
import { cn } from "@/modules/shared/utils/cn";
import { getFormatter, getTranslations } from "next-intl/server";
import Link from "next/link";

export type MovementDetailProps = {
  id: number;
  done_at: string;
  amount: number;
  comment: string;
  type: MovementTypes;
  categoryTitle: string;
  categoryIcon: string;
  categoryColor: string;
  accountName: string;
};

export async function MovementDetail({
  id,
  done_at,
  amount,
  comment,
  type,
  categoryTitle,
  categoryIcon,
  categoryColor,
  accountName,
}: MovementDetailProps) {
  const [tMovements, tCategories, format] = await Promise.all([
    getTranslations("movements"),
    getTranslations("categories"),
    getFormatter(),
  ]);

  const displayAmount = format.number(type === "expense" ? -amount : amount, {
    style: "currency",
    currency: "EUR",
    signDisplay: "auto",
  });

  const displayDate = format.dateTime(new Date(done_at), {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-md p-4 border bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3 items-center">
          <CategoryIcon
            icon={categoryIcon}
            color={categoryColor}
            size="24px"
            padding="p-[6px]"
          />
          <span className="font-medium">{tCategories(categoryTitle)}</span>
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
        <dd className="text-sm">{accountName}</dd>
      </div>

      <div className="rounded-md border py-2 px-3 flex flex-col gap-1 mb-3">
        <dt className="text-gray-500 text-xs">{tMovements("doneAt")}</dt>
        <dd className="text-sm">{displayDate}</dd>
      </div>
      <div className="rounded-md border py-2 px-3 flex flex-col gap-1">
        <dt className=" text-gray-500 text-xs">{tMovements("comment")}</dt>
        <dd className="text-sm">{comment}</dd>
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
