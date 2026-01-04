import type { AccountIds } from "@/types/general";
import { SelectAccount } from "../common/SelectAccount";

type Props = Readonly<{
  accountId: AccountIds;
}>;

export function ExpensesFilter({ accountId }: Props) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <SelectAccount accountId={accountId} />
    </div>
  );
}
