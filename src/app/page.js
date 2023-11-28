import Finances from "@/components/Finances/Finances";
import Balance from "@/components/Balance/Balance";
// import ExpensesByCat from "@/components/ExpensesByCat";
import DateSlider from "@/components/Finances/DateSlider";
import AddMovementButton from "@/components/AddMovementButton";
import FinancesSkeleton from "@/components/Finances/FinancesSkeleton";
import { Suspense } from "react";

export default async function MainPage({ searchParams }) {
  const year = searchParams?.year
    ? parseInt(searchParams.year)
    : new Date().getFullYear();
  const month = searchParams?.month
    ? parseInt(searchParams.month)
    : new Date().getMonth();

  return (
    <main className="mx-5 mb-5 max-w-lg sm:mx-auto">
      <DateSlider year={year} month={month} />
      <Balance currentPage={{ year, month }} />
      <Suspense key={Math.random()} fallback={<FinancesSkeleton />}>
        <Finances year={year} month={month} />
      </Suspense>
      <AddMovementButton year={year} month={month} />
    </main>
  );
}
