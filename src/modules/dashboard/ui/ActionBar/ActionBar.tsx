import { SelectAccount } from "@/modules/shared/ui/common/SelectAccount";
import { AddButton } from "./AddButton";

type Props = Readonly<{
  accountId: string;
}>;

export async function ActionBar({ accountId }: Props) {
  return (
    <div className="mb-4 flex justify-between items-center gap-4">
      <SelectAccount accountId={accountId} />
      <AddButton href="/movements/create" />
    </div>
  );
}
