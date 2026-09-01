"use client";

import { useData } from "@/modules/shared/stores/DataProvider";
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
  value: string;
  onValueChange: (value: string) => void;
}>;

export function AccountFilterSelect({ value, onValueChange }: Props) {
  const t = useTranslations("dashboard");
  const { accounts } = useData();

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full max-w-none bg-white">
        <SelectValue placeholder={t("selectPlaceholder")} />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        <SelectItem value="all">{t("allAccounts")}</SelectItem>
        <SelectGroup>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id?.toString() ?? ""}>
              {account.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
