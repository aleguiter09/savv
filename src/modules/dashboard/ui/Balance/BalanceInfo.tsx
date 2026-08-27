import {
  getAccounts,
  getAccountBalanceById,
} from "@/modules/accounts/services/accounts";
import {
  getMonthIncomes,
  getMonthExpenses,
} from "@/modules/movements/services/movements";
import { getLocale, getTranslations } from "next-intl/server";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";
import { AccountsCollapse } from "./AccountsCollapse";

type Props = Readonly<{
  accountId: string;
}>;

export async function BalanceInfo({ accountId }: Props) {
  const [locale, accountBalance, incomes, expenses, accounts, t] =
    await Promise.all([
      getLocale(),
      getAccountBalanceById(accountId),
      getMonthIncomes(accountId),
      getMonthExpenses(accountId),
      getAccounts(),
      getTranslations("dashboard"),
    ]);

  return (
    <div className="flex flex-col divide-y">
      <div className="pb-2">
        <p className="text-xs text-muted-foreground font-medium">
          {t("balanceAllAccounts")}
        </p>
        <p
          className={`text-2xl font-bold tabular-nums ${
            accountBalance < 0 ? "text-red-600" : ""
          }`}
        >
          {formatCurrency(locale, accountBalance, 2)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 py-2">
        <div>
          <p className="text-xs text-muted-foreground">{t("monthIncomes")}</p>
          <p className="text-base font-semibold tabular-nums text-green-600">
            {formatCurrency(locale, incomes, 2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t("monthExpenses")}</p>
          <p className="text-base font-semibold tabular-nums text-red-500">
            {formatCurrency(locale, expenses, 2)}
          </p>
        </div>
      </div>

      <div className="pt-2">
        <AccountsCollapse
          accounts={accounts}
          label={t("accounts")}
          locale={locale}
        />
      </div>
    </div>
  );
}

export function BalanceSkeleton({ loadingText }: { loadingText: string }) {
  return (
    <div className="flex flex-col divide-y">
      <div className="pb-3">
        <div className="h-3 w-36 rounded bg-muted animate-pulse" />
        <div className="mt-2 flex items-center py-1">
          <output
            className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent text-blue-600"
            aria-label={loadingText}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 py-3">
        <div className="h-10 rounded bg-muted animate-pulse" />
        <div className="h-10 rounded bg-muted animate-pulse" />
      </div>
      <div className="pt-2">
        <div className="h-4 w-20 rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}
