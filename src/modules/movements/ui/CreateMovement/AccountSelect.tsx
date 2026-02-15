import type { Account } from "@/modules/shared/types/global.types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useTranslations } from "next-intl";

type Props = Readonly<{
  label: string;
  accounts: Account[];
  value?: string;
  setValue: (v: string) => void;
  error?: string;
}>;

export function AccountSelect({
  label,
  accounts,
  value,
  setValue,
  error,
}: Props) {
  const t = useTranslations("movements");

  return (
    <div className="flex flex-col gap-1.5">
      <label className="block text-sm font-medium">{label}</label>
      <Select value={value ?? ""} onValueChange={setValue}>
        <SelectTrigger className={error ? "border border-rose-500" : ""}>
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
          <p className="text-xs text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
}
