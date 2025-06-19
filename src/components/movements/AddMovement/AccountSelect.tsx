import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Account } from "@/types/database";
import { useTranslations } from "next-intl";

type Props = Readonly<{
  label: string;
  accounts: Account[];
  from: string;
  setFrom: (v: string) => void;
  error: boolean;
  errorMessage?: string;
}>;

export function AccountSelect({
  label,
  accounts,
  from,
  setFrom,
  error,
  errorMessage,
}: Props) {
  const t = useTranslations("movements");

  return (
    <div className="flex flex-col gap-2 mb-2">
      <label className="block text-sm font-medium">{label}</label>
      <Select defaultValue={from} onValueChange={(v) => setFrom(v)}>
        <SelectTrigger className={`${error && "border border-rose-500"}`}>
          <SelectValue placeholder={t("selectAccount")} />
        </SelectTrigger>
        <SelectContent className="max-h-56">
          <SelectGroup>
            {accounts.map((account: Account) => (
              <SelectItem key={account.id} value={account.id?.toString() ?? ""}>
                {account.name}: ${account.balance.toFixed(2)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && (
        <div id="account-error" aria-live="polite" aria-atomic="true">
          <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
