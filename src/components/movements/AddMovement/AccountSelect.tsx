import { Account } from "@/types/database";
import { Select, SelectItem } from "@tremor/react";
import { useTranslations } from "next-intl";

type AccountSelectProps = {
  label: string;
  accounts: Account[];
  from: string;
  setFrom: (v: string) => void;
  error: boolean;
  errorMessage?: string;
};

export default function AccountSelect({
  label,
  accounts,
  from,
  setFrom,
  error,
  errorMessage,
}: Readonly<AccountSelectProps>) {
  const t = useTranslations("movements");

  return (
    <div className="flex flex-col gap-2 mb-2">
      <label className="block text-sm font-medium">{label}</label>
      <Select
        placeholder={t("selectAccount")}
        value={from}
        onValueChange={(v) => setFrom(v)}
        className={`${error && "border border-rose-500 rounded-lg"}`}
      >
        {accounts.map((account: Account) => (
          <SelectItem key={account.id} value={account.id?.toString() ?? ""}>
            {account.name}: ${account.balance.toFixed(2)}
          </SelectItem>
        ))}
      </Select>
      {error && (
        <div id="account-error" aria-live="polite" aria-atomic="true">
          <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
