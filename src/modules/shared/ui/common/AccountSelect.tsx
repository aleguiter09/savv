import { AccountView } from "@/modules/accounts/types/types";
import { cn } from "@/modules/shared/utils/cn";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useLocale, useTranslations } from "next-intl";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";

type Props = Readonly<{
  label: string;
  accounts: AccountView[];
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
  const locale = useLocale();

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className={cn("block text-sm font-medium", error && "text-red-500")}
      >
        {label}
      </label>
      <Select value={value ?? ""} onValueChange={setValue}>
        <SelectTrigger className={cn(error && "border-red-500")}>
          <SelectValue placeholder={t("selectAccount")} />
        </SelectTrigger>
        <SelectContent className="max-h-56">
          <SelectGroup>
            {accounts.map((account: AccountView) => (
              <SelectItem key={account.id} value={account.id?.toString() ?? ""}>
                {account.name}: {formatCurrency(locale, account.balance, 2)}
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
