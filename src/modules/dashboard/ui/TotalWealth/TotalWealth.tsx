import { Card } from "@/ui/card";
import { getAccounts } from "@/modules/accounts/services/accounts";
import { getTranslations, getFormatter } from "next-intl/server";
import { cn } from "@/modules/shared/utils/cn";

export async function TotalWealth() {
  const [t, format] = await Promise.all([
    getTranslations("dashboard"),
    getFormatter(),
  ]);
  const accounts = await getAccounts();

  const totalWealth = accounts.reduce((acc, account) => {
    return acc + account.balance;
  }, 0);

  return (
    <Card className="mb-4 pl-4 pr-3 py-2 shadow-md flex flex-col gap-1">
      <h5 className="font-medium text-xs">{t("totalWealth")}:</h5>
      <p className="text-2xl font-semibold">
        {format.number(totalWealth, {
          style: "currency",
          currency: "EUR",
          signDisplay: "auto",
        })}
      </p>
      <div className="flex flex-col gap-1 mt-2">
        {accounts.map((account) => (
          <div key={account.id} className="flex justify-between">
            <p className="text-xs mb-0">{account.name}:</p>
            <p
              className={cn(
                "text-xs",
                account.balance > 0 ? "" : "text-red-500",
              )}
            >
              {format.number(account.balance, {
                style: "currency",
                currency: "EUR",
                signDisplay: "auto",
              })}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
