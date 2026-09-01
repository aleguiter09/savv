import { CategoryIcon } from "@/modules/shared/ui/common/CategoryIcon";
import { cn } from "@/modules/shared/utils/cn";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { getCategoryLabel } from "@/modules/categories/utils/getCategoryLabel";
import type { MovementView } from "../../types/types";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";
import { EditMovementButton } from "../EditMovementButton";
import { ApplyMovementButton } from "../ApplyMovementButton";
import { SeriesDetailExtras } from "./SeriesDetailExtras";
import type { SeriesDetailContext } from "../../services/movement-series";

export async function MovementDetail({
  movement,
  series,
}: Readonly<{
  movement: MovementView;
  series?: SeriesDetailContext | null;
}>) {
  const { doneAt, amount, balanceAfter, description, type, category, account } =
    movement;
  const toAccount = type === "transfer" ? movement.toAccount : undefined;
  const [tMovements, tCategories, formatter, locale] = await Promise.all([
    getTranslations("movements"),
    getTranslations("categories"),
    getFormatter(),
    getLocale(),
  ]);

  const { icon, color, isGlobal, isCustomName, title } = category;

  const displayAmount = formatCurrency(
    locale,
    type === "expense" ? -amount : amount,
    2,
  );
  const displayBalanceAfter = formatCurrency(locale, balanceAfter, 2);

  const displayDate = formatter.dateTime(new Date(doneAt), {
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
            {getCategoryLabel(title, isGlobal, isCustomName, tCategories)}
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
        <dt className=" text-gray-500 text-xs">
          {type === "transfer" ? tMovements("chooseFrom") : tMovements("account")}
        </dt>
        <dd className="text-sm">{account.name}</dd>
      </div>
      {toAccount ? (
        <div className="rounded-md border py-2 px-3 flex flex-col gap-1 mb-3">
          <dt className=" text-gray-500 text-xs">{tMovements("chooseTo")}</dt>
          <dd className="text-sm">{toAccount.name}</dd>
        </div>
      ) : null}

      <div className="rounded-md border py-2 px-3 flex flex-col gap-1 mb-3">
        <dt className="text-gray-500 text-xs">{tMovements("doneAt")}</dt>
        <dd className="text-sm">{displayDate}</dd>
      </div>
      <div className="rounded-md border py-2 px-3 flex flex-col gap-1 mb-3">
        <dt className=" text-gray-500 text-xs">{tMovements("balanceAfter")}</dt>
        <dd className="text-sm">
          {movement.applied
            ? displayBalanceAfter
            : tMovements("pendingBalance")}
        </dd>
      </div>
      <div className="rounded-md border py-2 px-3 flex flex-col gap-1">
        <dt className=" text-gray-500 text-xs">{tMovements("description")}</dt>
        <dd className="text-sm">{description}</dd>
      </div>

      {series ? (
        <SeriesDetailExtras
          series={series}
          currentMovementId={movement.id}
          locale={locale}
        />
      ) : null}

      <div className="mt-3 flex flex-col gap-2">
        {!movement.applied ? (
          <ApplyMovementButton movementId={movement.id} />
        ) : null}
        <EditMovementButton movement={movement} />
      </div>
    </div>
  );
}
