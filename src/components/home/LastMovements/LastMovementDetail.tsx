import { MovementDB } from "@/types/database";
import { CATEGORY_ICONS } from "@/utils/constants";
import Icon from "@mdi/react";
import Link from "next/link";

export default function LastMovementDetail({
  id,
  done_at,
  amount,
  comment,
  type,
  fullCategory,
}: Readonly<MovementDB>) {
  return (
    <Link
      tabIndex={0}
      href={`/movements/${id}`}
      className="flex items-center justify-between px-1 pb-2 border-b border-gray-300 last:border-b-0 focus:ring-2 focus:ring-inset focus:ring-blue-600"
    >
      <div className="flex gap-3">
        <Icon
          className={`bg-${fullCategory.color} mx-auto rounded-full p-1.5 shadow-md`}
          path={CATEGORY_ICONS[fullCategory.icon]}
          size="36px"
          color="white"
        />
        <div className="flex flex-col">
          <span className="font-medium text-sm">{comment}</span>
          <span className="text-xs text-gray-500">{fullCategory.title}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1 text-right">
        <span
          className={`font-medium ${
            type === "expense" ? "text-red-500" : "text-green-600"
          }`}
        >{`${type === "expense" ? "-" : ""} $${amount.toFixed(2)}`}</span>
        <span className="text-xs text-gray-500">
          {new Date(done_at).toLocaleDateString("en-EN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </Link>
  );
}
