import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";
import { PhoneFrame } from "../PhoneFrame";

export async function AccountsPreviewMock() {
  const t = await getTranslations("landing.mocks");

  const accounts = [
    { name: t("checking"), amount: "4.320,00" },
    { name: t("savings"), amount: "12.100,00" },
    { name: t("cash"), amount: "2.500,00" },
  ];

  return (
    <PhoneFrame>
      <Card className="border-b-4 border-b-blue-600 px-3 py-3 shadow-md">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {t("netWorth")}
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">18.920,00</p>
      </Card>
      <Card className="px-3 py-3 shadow-md">
        <p className="mb-3 text-sm font-semibold">{t("accounts")}</p>
        <ul className="space-y-3 text-sm">
          {accounts.map((account) => (
            <li
              key={account.name}
              className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0 last:pb-0"
            >
              <span className="text-gray-700">{account.name}</span>
              <span className="font-medium tabular-nums">{account.amount}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="px-3 py-3 shadow-md">
        <p className="mb-2 text-sm font-semibold">{t("balance")}</p>
        <div className="flex h-16 items-end gap-1 px-1">
          {[40, 48, 44, 58, 52, 66, 72].map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-sm bg-blue-500/80"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </Card>
    </PhoneFrame>
  );
}
