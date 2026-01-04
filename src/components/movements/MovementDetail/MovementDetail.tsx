import type { Movement } from "@/types/global.types";
import { CategoryIcon } from "@/components/common/CategoryIcon";
import { getFormatter, getTranslations } from "next-intl/server";
import Link from "next/link";

export async function MovementDetail({
  id,
  done_at,
  amount,
  comment,
  type,
  fullCategory,
  fullAccount,
}: Readonly<Movement>) {
  const [t, format] = await Promise.all([getTranslations(), getFormatter()]);

  return (
    <div className="rounded-md p-4 border bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3 items-center">
          <CategoryIcon
            icon={fullCategory?.icon ?? "transfer"}
            color={fullCategory?.color ?? "gray"}
            size="24px"
            padding="p-[6px]"
          />
          <span className="font-medium">
            {t(`categories.${fullCategory?.title ?? "transfer"}`)}
          </span>
        </div>
        <span
          className={`text-lg font-medium ${
            type === "expense" ? "text-red-500" : "text-green-600"
          }`}
        >{`${type === "expense" ? "-" : ""} $${amount.toFixed(2)}`}</span>
      </div>
      <div className="rounded-md border py-2 px-3 flex flex-col gap-1 mb-3">
        <span className=" text-gray-500 text-xs">{t("movements.account")}</span>
        <span className="text-sm">{fullAccount?.name}</span>
      </div>
      <div className="rounded-md border py-2 px-3 flex flex-col gap-1 mb-3">
        <span className="text-gray-500 text-xs">{t("movements.doneAt")}</span>
        <span className="text-sm">
          {format.dateTime(new Date(done_at), {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
      <div className="rounded-md border py-2 px-3 flex flex-col gap-1">
        <span className=" text-gray-500 text-xs">{t("movements.comment")}</span>
        <span className="text-sm">{comment}</span>
      </div>
      <div className="mt-3 flex gap-2">
        <Link
          href={`/movements/${id}/edit`}
          className="w-full text-center rounded-md bg-blue-600 py-2 text-sm font-medium text-white"
        >
          {t("movements.edit")}
        </Link>
      </div>
    </div>
  );
}
