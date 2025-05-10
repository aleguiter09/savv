import { Account } from "@/types/database";
import SelectAccountClient from "./SelectAccountClient";

export default async function SelectAccount({
  accounts,
  defaultAcc,
  containerClassName,
}: Readonly<{
  accounts: Account[];
  defaultAcc: number;
  containerClassName?: string;
}>) {
  return (
    <SelectAccountClient
      accounts={accounts}
      defaultAcc={defaultAcc}
      containerClassName={containerClassName}
    />
  );
}
