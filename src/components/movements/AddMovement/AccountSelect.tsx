import { AccountDB } from "@/types/database";
import { Select, SelectItem } from "@tremor/react";

type AccountSelectProps = {
  label: string;
  accounts: AccountDB[];
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
  return (
    <div className="flex flex-col gap-1 mb-2">
      <label className="block text-sm font-medium">{label}</label>
      <Select
        placeholder="Select an account"
        enableClear={false}
        value={from}
        onValueChange={(v) => setFrom(v)}
        className={`${error && "border border-rose-500 rounded-lg"}`}
      >
        {accounts.map((account: AccountDB) => (
          <SelectItem key={account.id} value={account.id.toString()}>
            {account.name}
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
