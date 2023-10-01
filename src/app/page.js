import Navbar from "@/components/Navbar/Navbar";
import Finances from "@/components/Finances";
import ExpensesByCat from "@/components/ExpensesByCat";
import MovementsModal from "@/components/MovementsModal";
import DateSlider from "@/components/Finances/DateSlider";
import AddMovementButton from "@/components/AddMovementButton";

export default function MainPage({ searchParams }) {
  const year = searchParams?.year;
  const month = searchParams?.month;
  const showModal = searchParams?.modal;

  return (
    <>
      <Navbar />
      <main className="mx-5 mb-5 h-screen max-w-lg sm:mx-auto">
        {showModal && <MovementsModal />}
        <DateSlider
          year={year ? parseInt(year) : new Date().getFullYear()}
          month={month ? parseInt(month) : new Date().getMonth()}
        />
        <Finances
          year={year ? parseInt(year) : new Date().getFullYear()}
          month={month ? parseInt(month) : new Date().getMonth()}
        />
      </main>
      <AddMovementButton year={year} month={month} />
    </>
  );
}
