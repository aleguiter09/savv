import { SelectAccount } from "../common/SelectAccount";

export default function ExpensesFilter({
  account,
}: Readonly<{ account: number }>) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <SelectAccount accountId={account} />
    </div>
  );
}
