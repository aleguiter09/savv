import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";
import { PhoneFrame } from "../PhoneFrame";

type Props = Readonly<{
  label?: string;
}>;

export async function HeroDashboardMock({ label }: Props) {
  const t = await getTranslations("landing.mocks");

  return (
    <PhoneFrame label={label}>
      <Card className="border-b-4 border-b-blue-600 px-3 py-3 shadow-md">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {t("balance")}
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-gray-900">
          12.450,00
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">{t("income")}</p>
            <p className="font-medium text-green-600">+3.200</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("expense")}</p>
            <p className="font-medium text-red-600">−1.850</p>
          </div>
        </div>
      </Card>

      <Card className="px-3 py-3 shadow-md">
        <p className="mb-2 text-sm font-semibold">{t("recent")}</p>
        <ul className="space-y-2.5 text-sm">
          <li className="flex items-center justify-between gap-2">
            <span className="truncate text-gray-700">{t("salary")}</span>
            <span className="shrink-0 font-medium text-green-600">+2.800</span>
          </li>
          <li className="flex items-center justify-between gap-2">
            <span className="truncate text-gray-700">{t("groceries")}</span>
            <span className="shrink-0 font-medium text-red-600">−64,50</span>
          </li>
          <li className="flex items-center justify-between gap-2">
            <span className="truncate text-gray-700">{t("transfer")}</span>
            <span className="shrink-0 font-medium text-blue-600">500</span>
          </li>
        </ul>
      </Card>

      <Card className="px-3 py-3 shadow-md">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {t("netWorth")}
        </p>
        <p className="mt-1 text-xl font-semibold tabular-nums">18.920,00</p>
      </Card>
    </PhoneFrame>
  );
}
