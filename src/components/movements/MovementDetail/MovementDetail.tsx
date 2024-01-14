import { MovementDB } from "@/types/database";
import { CATEGORY_ICONS } from "@/utils/constants";
import Icon from "@mdi/react";
import Link from "next/link";

export default function MovementDetail({
  id,
  done_at,
  amount,
  comment,
  type,
  fullCategory,
  fullAccount,
}: Readonly<MovementDB>) {
  return (
    <div className="rounded-md bg-gray-100 p-3">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3 items-center">
          <Icon
            className={`bg-${fullCategory.color} rounded-full p-1.5`}
            path={CATEGORY_ICONS[fullCategory.icon]}
            size="42px"
            color="white"
          />
          <span className="font-medium">{fullCategory.title}</span>
        </div>
        <span
          className={`text-lg font-medium ${
            type === "expense" ? "text-red-500" : "text-green-600"
          }`}
        >{`${type === "expense" ? "-" : ""} $${amount.toFixed(2)}`}</span>
      </div>
      <div className="rounded-md bg-gray-200 py-2 px-3 flex flex-col gap-1 mb-3">
        <span className="font-medium text-gray-500 text-sm">Account</span>
        <span className="font-medium">{fullAccount.name}</span>
      </div>
      <div className="rounded-md bg-gray-200 py-2 px-3 flex flex-col gap-1 mb-3">
        <span className="font-medium text-gray-500 text-sm">Done at</span>
        <span>
          {new Date(done_at).toLocaleDateString("en-EN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
      <div className="rounded-md bg-gray-200 py-2 px-3 flex flex-col gap-1">
        <span className="font-medium text-gray-500 text-sm">Comment</span>
        <span className="">{comment}</span>
      </div>
      <div className="mt-3 flex flex-row gap-2">
        <button className="w-full rounded-md bg-gray-500 py-2 text-sm font-semibold text-white disabled:opacity-60">
          Close
        </button>
        <Link
          href={`/movements/${id}/edit`}
          className="w-full text-center rounded-md bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
