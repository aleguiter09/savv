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

export default function MainPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar />
      <main className="mx-5 mb-5 h-screen max-w-lg sm:mx-auto">
        {showModal && <MovementsModal closeModal={() => setShowModal(false)} />}
        <section>
          <Card className="mb-4 flex justify-between px-3 py-2">
            <Icon color="blue" size="sm" icon={ArrowLeftIcon} />
            <h5 className="mt-1 text-lg font-semibold">August 2023</h5>
            <Icon color="blue" size="sm" icon={ArrowRightIcon} />
          </Card>
        </section>
        <Finances />

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
