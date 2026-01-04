import type { AccountIds } from "@/types/general";
import { SelectAccount } from "@/components/common/SelectAccount";
import { AddButton } from "./AddButton";

type Props = Readonly<{
  accountId: AccountIds;
}>;

export async function ActionBar({ accountId }: Props) {
  return (
    <div className="mb-4 flex justify-between items-center gap-4">
      <SelectAccount accountId={accountId} />
      <AddButton href="/movements/create" />
    </div>
  );
}
