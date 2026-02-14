import { SelectAccount } from "@/modules/shared/ui/common/SelectAccount";
import { SelectCategory } from "@/modules/shared/ui/common/SelectCategory";
import { SelectDate } from "./SelectDate";

type Props = Readonly<{
  from: Date;
  to: Date;
  accountId: string;
  categoryId: string;
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
