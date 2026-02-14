import { SelectAccount } from "@/modules/shared/ui/common/SelectAccount";

type Props = Readonly<{
  accountId: string;
}>;

export function ExpensesFilter({ accountId }: Props) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <SelectAccount accountId={accountId} />
    </div>
  );
}
