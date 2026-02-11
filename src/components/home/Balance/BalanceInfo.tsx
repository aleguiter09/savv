import type { AccountIds } from "@/types/general";
import { getAccountBalanceById } from "@/services/accounts";
import { getMonthIncomes, getMonthExpenses } from "@/services/movements";
import { getTranslations } from "next-intl/server";

type Props = Readonly<{
  accountId: AccountIds;
}>;

export async function BalanceInfo({ accountId }: Props) {
  const [accountBalance, incomes, expenses, t] = await Promise.all([
    getAccountBalanceById(accountId),
    getMonthIncomes(accountId),
    getMonthExpenses(accountId),
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

export function BalanceSkeleton({ loadingText }: { loadingText: string }) {
  return (
    <div className="grid grid-cols-3 text-center">
      <div>
        <div className="flex gap-2 items-center justify-center">
          <p className="font-semibold"></p>
        </div>
        <div className="flex w-full justify-center py-2">
          <output
            className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent text-blue-600"
            aria-label={loadingText}
          />
        </div>
      </div>
      <div>
        <p className="font-semibold"></p>
        <div className=" flex w-full justify-center py-2">
          <output
            className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent text-blue-600"
            aria-label={loadingText}
          />
        </div>
      </div>
      <div>
        <p className="font-semibold"></p>
        <div className="flex w-full justify-center py-2">
          <output
            className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent text-blue-600"
            aria-label={loadingText}
          />
        </div>
      </div>
    </div>
  );
}
