import { getLastMovements } from "@/services/movements";
import LastMovementDetail from "./LastMovementDetail";
import { getTranslations } from "next-intl/server";

export default async function LastMovementsList({
  account,
}: Readonly<{ account: number }>) {
  const t = await getTranslations("home");
  const movements = await getLastMovements(account);

  return (
    <div className="flex flex-col gap-2 mt-3">
      {movements.map((item) => (
        <LastMovementDetail key={item.id} {...item} />
      ))}
      {movements.length === 0 && (
        <p className="pt-2 text-sm text-slate-500 text-center col-span-3">
          {t("noMovements")}
        </p>
      )}
    </div>
  );
}
