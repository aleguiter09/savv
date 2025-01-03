"use client";
import { SelectAccountProps } from "@/types/components";
import { AccountDB } from "@/types/database";
import { Select, SelectItem } from "@tremor/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SelectAccountClient({
  accounts,
  defaultAcc,
  containerClassName = "",
}: Readonly<SelectAccountProps>) {
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
        {accounts.map((account: AccountDB) => (
          <SelectItem key={account.id} value={account.id.toString()}>
            {account.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
