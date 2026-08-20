import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";

export async function AccountsPreviewMock() {
  const t = await getTranslations("landing.mocks");

  const accounts = [
    { name: t("checking"), amount: "4.320,00" },
    { name: t("savings"), amount: "12.100,00" },
    { name: t("cash"), amount: "2.500,00" },
  ];

  return (
    <div aria-hidden="true" className="rounded-2xl border bg-gray-50 p-4">
      <Card className="px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("netWorth")}
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">18.920,00</p>
      </Card>
      <Card className="mt-3 px-4 py-3 shadow-md">
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
    </div>
  );
}
