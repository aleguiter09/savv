import SelectAccount from "@/components/home/ActionBar/SelectAccount";
import SelectAccountSkeleton from "@/components/home/ActionBar/SelectAccountSkeleton";
import React, { Suspense } from "react";
import SelectCategory from "./SelectCategory";
import SelectDateClient from "./SelectDateClient";

export default function MovementsFilter({
  from,
  to,
  accountId,
  categoryId,
}: Readonly<{ from: Date; to: Date; accountId: number; categoryId: number }>) {
  return (
    <div className="mb-4 flex flex-col gap-2">
      <SelectDateClient from={from} to={to} />
      <div className="flex items-center gap-2">
        <Suspense fallback={<SelectAccountSkeleton />}>
          <SelectAccount
            defaultAcc={accountId}
            containerClassName={"w-full max-w-none"}
          />
        </Suspense>
        <Suspense fallback={<SelectAccountSkeleton />}>
          <SelectCategory categoryId={categoryId} />
        </Suspense>
      </div>
    </div>
  );
}
