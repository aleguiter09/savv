"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AccountFilterSelect } from "./AccountFilterSelect";

type Props = Readonly<{
  accountId: string;
}>;

export function SelectAccount({ accountId }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("account", value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <AccountFilterSelect value={accountId} onValueChange={handleSelect} />
  );
}
