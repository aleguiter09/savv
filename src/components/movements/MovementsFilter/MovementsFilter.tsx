import type { AccountIds, CategoryIds } from "@/types/general";
import { SelectAccount } from "@/components/common/SelectAccount";
import { SelectCategory } from "@/components/common/SelectCategory";
import { SelectDate } from "./SelectDate";

type Props = Readonly<{
  from: Date;
  to: Date;
  accountId: AccountIds;
  categoryId: CategoryIds;
}>;

export function MovementsFilter({ accountId, from, to, categoryId }: Props) {
  return (
    <div className="mb-4 flex flex-col gap-2">
      <SelectDate from={from} to={to} />
      <div className="flex items-center gap-2">
        <SelectAccount accountId={accountId} />
        <SelectCategory categoryId={categoryId} />
      </div>
    </div>
  );
}
