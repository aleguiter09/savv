"use client";
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
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useData } from "@/modules/shared/stores/DataProvider";

type Props = Readonly<{
  accountId: string;
}>;

export function SelectAccount({ accountId }: Props) {
  const t = useTranslations("home");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { accounts } = useData();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("account", value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select defaultValue={accountId} onValueChange={handleSelect}>
      <SelectTrigger className="w-full max-w-none bg-white">
        <SelectValue placeholder={t("selectPlaceholder")} />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        <SelectItem value="all">{t("allAccounts")}</SelectItem>
        <SelectGroup>
          {accounts.map((account: Account) => (
            <SelectItem key={account.id} value={account.id?.toString() ?? ""}>
              {account.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
