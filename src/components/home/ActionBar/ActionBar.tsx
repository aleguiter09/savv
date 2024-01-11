import SelectAccountSkeleton from "./SelectAccountSkeleton";
import SelectAccount from "./SelectAccount";
import AddButton from "./AddButton";
import { Suspense } from "react";

export default async function ActionBar() {
  return (
    <div className="mb-4 flex justify-between items-center">
      <Suspense fallback={<SelectAccountSkeleton />}>
        <SelectAccount />
      </Suspense>
      <AddButton href="/movements/create" />
    </div>
  );
}
