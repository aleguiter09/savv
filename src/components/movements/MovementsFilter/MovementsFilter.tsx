import { SelectAccount } from "@/components/common/SelectAccount";
import SelectDateClient from "./SelectDateClient";
import { SelectCategory } from "@/components/common/SelectCategory";
import { AccountIds, CategoryIds } from "@/types/general";

type Props = Readonly<{
  from: Date;
  to: Date;
  accountId: AccountIds;
  categoryId: CategoryIds;
}>;

export function MovementsFilter({ accountId, from, to, categoryId }: Props) {
  return (
    <div className="mb-4 flex flex-col gap-2">
      <SelectDateClient from={from} to={to} />
      <div className="flex items-center gap-2">
        <SelectAccount accountId={accountId} />
        <SelectCategory categoryId={categoryId} />
      </div>
    </div>
  );
}
