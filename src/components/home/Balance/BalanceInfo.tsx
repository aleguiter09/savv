import { getAccountBalanceById } from "@/services/accounts";
import { getMonthIncomes, getMonthExpenses } from "@/services/movements";
import { getTranslations } from "next-intl/server";

export default async function BalanceInfo({
  account,
}: Readonly<{ account: number }>) {
  const [accountBalance, incomes, expenses, t] = await Promise.all([
    getAccountBalanceById(account),
    getMonthIncomes(account),
    getMonthExpenses(account),
    getTranslations("home"),
  ]);

  return (
    <div className="grid grid-cols-3 text-center">
      <div>
        <div className="flex gap-2 items-center justify-center">
          <p className="font-semibold">{t("balance")}</p>
        </div>
        <p className={accountBalance < 0 ? "text-red-600" : ""}>
          ${accountBalance.toFixed(2)}
        </p>
      </div>
      <div>
        <p className="font-semibold">{t("incomes")}</p>
        <p className={accountBalance < 0 ? "text-red-600" : ""}>
          ${incomes.toFixed(2)}
        </p>
      </div>
      <div>
        <p className="font-semibold">{t("expenses")}</p>
        <p className={accountBalance < 0 ? "text-red-600" : ""}>
          ${expenses.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
