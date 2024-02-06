import SelectAccountSkeleton from "./SelectAccountSkeleton";
import SelectAccount from "./SelectAccount";
import AddButton from "./AddButton";
import { Suspense } from "react";

export default async function ActionBar({
  defaultAcc,
}: Readonly<{ defaultAcc: number }>) {
  return (
    <div className="mb-4 flex justify-between items-center">
      <Suspense fallback={<SelectAccountSkeleton />}>
        <SelectAccount defaultAcc={defaultAcc} />
      </Suspense>
      <AddButton href="/movements/create" />
    </div>
  );
}
