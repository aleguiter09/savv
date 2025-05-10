import SelectAccount from "@/components/home/ActionBar/SelectAccount";
import { Account } from "@/types/database";

export default function ExpensesFilter({
  accounts,
  accountId,
}: Readonly<{ accounts: Account[]; accountId: number }>) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <SelectAccount
        accounts={accounts}
        defaultAcc={accountId}
        containerClassName="w-full max-w-none"
      />
    </div>
  );
}
