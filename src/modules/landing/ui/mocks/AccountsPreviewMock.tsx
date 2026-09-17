import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";

export async function AccountsPreviewMock() {
  const t = await getTranslations("landing.mocks");

  const accounts = [
    { name: t("checking"), amount: "4.320,00", tone: "bg-primary" },
    { name: t("savings"), amount: "12.100,00", tone: "bg-primary/70" },
    { name: t("cash"), amount: "2.500,00", tone: "bg-primary/40" },
  ];

  return (
    <div
      aria-hidden="true"
      className="h-full rounded-2xl border border-border/80 bg-background p-4 shadow-xs"
    >
      <Card className="px-4 py-3 shadow-xs">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("netWorth")}
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
          18.920,00
        </p>
      </Card>
      <Card className="mt-3 px-4 py-3 shadow-xs">
        <p className="mb-3 text-sm font-semibold text-foreground">
          {t("accounts")}
        </p>
        <ul className="space-y-3 text-sm">
          {accounts.map((account) => (
            <li
              key={account.name}
              className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 last:border-0 last:pb-0"
            >
              <span className="flex items-center gap-2 text-foreground">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${account.tone}`}
                />
                {account.name}
              </span>
              <span className="font-medium tabular-nums">{account.amount}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
