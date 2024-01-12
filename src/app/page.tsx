import Finances from "@/components/home/Finances/Finances";
import Balance from "@/components/home/Balance/Balance";
import { Suspense } from "react";
import ActionBar from "@/components/home/ActionBar/ActionBar";
import { MainPageParams } from "@/types/pages";
import BalanceSkeleton from "@/components/home/Balance/BalanceSkeleton";

export default async function MainPage({
  searchParams,
}: Readonly<MainPageParams>) {
  const account = Number(searchParams.account) || 0;

  return (
    <>
      <ActionBar />
      <Suspense key={account} fallback={<BalanceSkeleton />}>
        <Balance account={account} />
      </Suspense>
      <Finances account={account} />
    </>
  );
}
