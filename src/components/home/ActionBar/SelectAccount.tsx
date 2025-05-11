"use client";
import { useData } from "@/providers/DataProvider";
import { Account } from "@/types/database";
import { Select, SelectItem } from "@tremor/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SelectAccountProps = {
  defaultAcc: number;
  containerClassName?: string;
};

export default function SelectAccount({
  defaultAcc,
  containerClassName = "",
}: Readonly<SelectAccountProps>) {
  const accounts = useData();
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
        className={containerClassName}
        defaultValue={defaultAcc.toString()}
        onValueChange={handleSelect}
        enableClear={false}
      >
        <SelectItem value="0">All accounts</SelectItem>
        {accounts.map((account: Account) => (
          <SelectItem key={account.id} value={account.id?.toString() ?? ""}>
            {account.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
