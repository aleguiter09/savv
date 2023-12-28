import Finances from "@/components/Finances/Finances";
import Balance from "@/components/Balance/Balance";
import DateSlider from "@/components/Finances/DateSlider";
import AddMovementButton from "@/components/AddMovementButton";
import FinancesSkeleton from "@/components/Finances/FinancesSkeleton";
import { Suspense } from "react";
import MovementsModal from "@/components/MovementsModal/MovementsModal";
import { MainPageParams } from "@/types/pages";

export default async function MainPage({
  searchParams,
}: Readonly<MainPageParams>) {
  const year: number = searchParams?.year
    ? parseInt(searchParams.year)
    : new Date().getFullYear();
  const month: number = searchParams?.month
    ? parseInt(searchParams.month)
    : new Date().getMonth();
  const showModal: boolean = !!searchParams?.modal;

  return (
    <main className="mx-5 mb-5 max-w-lg sm:mx-auto">
      <DateSlider year={year} month={month} />
      <Balance year={year} month={month} />
      <Suspense fallback={<FinancesSkeleton />}>
        <Finances year={year} month={month} />
      </Suspense>

      {showModal && <MovementsModal />}
      <AddMovementButton />
    </main>
  );
}
