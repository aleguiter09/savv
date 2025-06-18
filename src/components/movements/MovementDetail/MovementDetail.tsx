import { Category, Movement } from "@/types/database";
import { CATEGORY_ICONS } from "@/utils/constants";
import Icon from "@mdi/react";
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
          <Icon
            className={`bg-${fullCategory?.color} rounded-full p-2`}
            path={CATEGORY_ICONS[fullCategory?.icon ?? "other"]}
            size="42px"
            color="white"
          />
          <span className="text-lg font-medium">
            {t(`categories.${(fullCategory as Category).title}`)}
          </span>
        </div>
        <span
          className={`text-xl font-medium ${
            type === "expense" ? "text-red-500" : "text-green-600"
          }`}
        >{`${type === "expense" ? "-" : ""} $${amount.toFixed(2)}`}</span>
      </div>
      <div className="rounded-md border  py-2 px-3 flex flex-col gap-1 mb-3">
        <span className=" text-gray-500 text-sm">{t("movements.account")}</span>
        <span>{fullAccount?.name}</span>
      </div>
      <div className="rounded-md border py-2 px-3 flex flex-col gap-1 mb-3">
        <span className="text-gray-500 text-sm">{t("movements.doneAt")}</span>
        <span>
          {format.dateTime(new Date(done_at), {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
      <div className="rounded-md border py-2 px-3 flex flex-col gap-1">
        <span className=" text-gray-500 text-sm">{t("movements.comment")}</span>
        <span>{comment}</span>
      </div>
      <div className="mt-3 flex gap-2">
        <Link
          href={`/movements/${id}/edit`}
          className="w-full text-center rounded-md bg-blue-600 py-2 text-sm font-semibold text-white"
        >
          {t("movements.edit")}
        </Link>
      </div>
    </div>
  );
}
