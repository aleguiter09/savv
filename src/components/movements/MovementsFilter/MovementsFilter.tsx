import SelectAccount from "@/components/home/ActionBar/SelectAccount";
import SelectCategory from "./SelectCategory";
import SelectDateClient from "./SelectDateClient";
import { Account } from "@/types/database";

export default function MovementsFilter({
  accounts,
  from,
  to,
  accountId,
  categoryId,
}: Readonly<{
  accounts: Account[];
  from: Date;
  to: Date;
  accountId: number;
  categoryId: number;
}>) {
  return (
    <div className="mb-4 flex flex-col gap-2">
      <SelectDateClient from={from} to={to} />
      <div className="flex items-center gap-2">
        <SelectAccount
          accounts={accounts}
          defaultAcc={accountId}
          containerClassName="w-full max-w-none"
        />
        <SelectCategory categoryId={categoryId} />
      </div>
    </div>
  );
}
