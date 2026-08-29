import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";

export async function HeroDashboardMock() {
  const t = await getTranslations("landing.mocks");

  const movements = [
    {
      description: t("salary"),
      category: t("salaryCategory"),
      amount: "+2.800,00",
      date: t("dates.salary"),
      tone: "income" as const,
      swatch: "bg-green-500",
    },
    {
      description: t("groceries"),
      category: t("food"),
      amount: "−64,50",
      date: t("dates.groceries"),
      tone: "expense" as const,
      swatch: "bg-orange-500",
    },
    {
      description: t("transfer"),
      category: t("transferCategory"),
      amount: "500,00",
      date: t("dates.transfer"),
      tone: "transfer" as const,
      swatch: "bg-blue-500",
    },
  ];

  const accounts = [
    { name: t("checking"), balance: "4.320,00" },
    { name: t("savings"), balance: "5.630,00" },
    { name: t("cash"), balance: "2.500,00" },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none rounded-2xl border border-dashed border-gray-300 bg-gray-50/90 p-3 sm:p-4"
    >
      <Card className="mb-3 border-b-4 border-b-blue-600 px-4 py-3 shadow-sm">
        <div className="flex flex-col divide-y divide-gray-200">
          <div className="pb-2">
            <p className="text-xs font-medium text-muted-foreground">
              {t("balanceAllAccounts")}
            </p>
            <p className="text-2xl font-bold tabular-nums tracking-tight text-gray-900">
              12.450,00
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div>
              <p className="text-xs text-muted-foreground">{t("monthIncomes")}</p>
              <p className="text-base font-semibold tabular-nums text-green-600">
                3.200,00
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("monthExpenses")}
              </p>
              <p className="text-base font-semibold tabular-nums text-red-500">
                1.850,00
              </p>
            </div>
          </div>

          <div className="pt-2">
            <p className="py-1 text-xs font-medium text-muted-foreground">
              {t("accounts")}
            </p>
            <div className="flex flex-col gap-1.5 pt-1">
              {accounts.map((account) => (
                <div
                  key={account.name}
                  className="flex justify-between gap-2"
                >
                  <p className="mb-0 text-xs text-muted-foreground">
                    {account.name}
                  </p>
                  <p className="text-xs font-medium tabular-nums text-gray-900">
                    {account.balance}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="px-4 py-2 shadow-sm">
        <p className="mb-2 font-semibold text-gray-900">{t("lastMovements")}</p>
        <ul>
          {movements.map((row) => (
            <li
              key={row.description}
              className="flex items-center justify-between border-b border-gray-200 px-1 py-2 last:border-b-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-sm ${row.swatch}`}
                />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-gray-900">
                    {row.description}
                  </span>
                  <span className="text-xs text-gray-500">{row.category}</span>
                </div>
              </div>
              <div className="ml-3 flex shrink-0 flex-col gap-0.5 text-right">
                <span
                  className={
                    row.tone === "expense"
                      ? "text-sm font-medium tabular-nums text-red-500"
                      : row.tone === "income"
                        ? "text-sm font-medium tabular-nums text-green-500"
                        : "text-sm font-medium tabular-nums text-gray-500"
                  }
                >
                  {row.amount}
                </span>
                <span className="text-xs text-gray-500">{row.date}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
