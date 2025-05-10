import SelectAccount from "./SelectAccount";
import AddButton from "./AddButton";
import { Account } from "@/types/database";

export default async function ActionBar({
  accounts,
  defaultAcc,
}: Readonly<{ accounts: Account[]; defaultAcc: number }>) {
  return (
    <div className="mb-4 flex justify-between items-center">
      <SelectAccount accounts={accounts} defaultAcc={defaultAcc} />
      <AddButton href="/movements/create" />
    </div>
  );
}
