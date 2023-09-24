"use client";
import {
  PlusIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/outline";
import { useState } from "react";
import { Card, Icon } from "@tremor/react";
import Navbar from "@/components/Navbar";
import Finances from "@/components/Finances";
import ExpensesByCat from "@/components/ExpensesByCat";
import MovementsModal from "@/components/MovementsModal";
import { MONTHS } from "@/utils/constants";

export default function MainPage() {
  const [showModal, setShowModal] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  const handleArrowClick = (increase) => {
    if (increase) {
      if (month === 11) {
        setMonth(0);
        setYear(year + 1);
      } else setMonth(month + 1);
    } else {
      if (month === 0) {
        setMonth(11);
        setYear(year - 1);
      } else setMonth(month - 1);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-5 mb-5 h-screen max-w-lg sm:mx-auto">
        {showModal && <MovementsModal closeModal={() => setShowModal(false)} />}
        <section>
          <Card className="mb-4 flex justify-between px-3 py-2">
            <Icon
              color="blue"
              size="sm"
              icon={ArrowLeftIcon}
              onClick={() => handleArrowClick(false)}
            />
            <h5 className="mt-1 text-lg font-semibold">
              {MONTHS[month]} {year}
            </h5>
            <Icon
              color="blue"
              size="sm"
              icon={ArrowRightIcon}
              onClick={() => handleArrowClick(true)}
            />
          </Card>
        </section>
        <Finances year={year} month={month} />

        <div className="fixed bottom-0 left-0 right-0 mt-6 flex justify-center">
          <button
            className="mb-2 h-12 w-12 rounded-full bg-blue-600 p-3 text-white"
            onClick={() => setShowModal(true)}
          >
            <PlusIcon />
          </button>
        </div>
      </main>
    </>
  );
}
