"use client";
import { useData } from "@/providers/DataProvider";
import { Account } from "@/types/database";
import { Select, SelectItem } from "@tremor/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SelectAccountProps = {
  containerClassName?: string;
  defaultAcc: number;
};

export default function SelectAccount({
  containerClassName = "",
  defaultAcc,
}: Readonly<SelectAccountProps>) {
  const { accounts } = useData();
  const t = useTranslations("home");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("account", value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={containerClassName}>
      <Select
        placeholder={t("selectAccount")}
        className={containerClassName}
        defaultValue={defaultAcc.toString()}
        onValueChange={handleSelect}
        enableClear={false}
      >
        <SelectItem value="0">{t("allAccounts")}</SelectItem>
        {accounts.map((account: Account) => (
          <SelectItem key={account.id} value={account.id?.toString() ?? ""}>
            {account.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
