import Finances from "@/components/home/Finances/Finances";
import Balance from "@/components/home/Balance/Balance";
import FinancesSkeleton from "@/components/home/Finances/FinancesSkeleton";
import { Suspense } from "react";
import ActionBar from "@/components/home/ActionBar";
import { MainPageParams } from "@/types/pages";

export default async function MainPage({ searchParams }: MainPageParams) {
  const account = Number(searchParams.account) || 0;

  return (
    <main className="mx-5 sm:w-[32rem] sm:self-center">
      <ActionBar />
      <Suspense key={searchParams.account} fallback={<h3>Loading...</h3>}>
        <Balance account={account} />
      </Suspense>
      <Suspense fallback={<FinancesSkeleton />}>
        <Finances />
      </Suspense>
    </main>
  );
}
