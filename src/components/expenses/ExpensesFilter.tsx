import SelectAccount from "@/components/home/ActionBar/SelectAccount";
import SelectAccountSkeleton from "@/components/home/ActionBar/SelectAccountSkeleton";
import React, { Suspense } from "react";

export default function ExpensesFilter({
  accountId,
}: Readonly<{ accountId: number }>) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Suspense fallback={<SelectAccountSkeleton />}>
        <SelectAccount
          defaultAcc={accountId}
          containerClassName={"w-full max-w-none"}
        />
      </Suspense>
    </div>
  );
}
