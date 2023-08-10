"use client";
import { useAuth } from "@/context/authContext";
import {
  PlusIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/outline";
import ExpensesByCat from "@/components/ExpensesByCat";
import Finances from "@/components/Finances";
import { Card, Icon as TremorIcon } from "@tremor/react";
import MovementsModal from "@/components/MovementsModal";
import { useState } from "react";

export default function MainPage() {
  const { signOut } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="mx-5 my-5 h-screen max-w-lg sm:mx-auto">
      {showModal && <MovementsModal closeModal={() => setShowModal(false)} />}
      <Card className="mb-4 flex justify-between px-3 py-2">
        <TremorIcon color="blue" size="sm" icon={ArrowLeftIcon} />
        <h5 className="mt-1 text-lg font-semibold">June 2023</h5>
        <TremorIcon color="blue" size="sm" icon={ArrowRightIcon} />
      </Card>

      <Finances />
      <ExpensesByCat />
      {/*
      <button
      className=
        "rounded-md w-full py-2 font-semibold text-sm text-white bg-blue-600 disabled:opacity-60"
      
      onClick={signOut}
    >
      Log out
    </button>*/}
      <div className="fixed bottom-0 left-0 right-0 mt-6 flex justify-center">
        <button
          className="mb-2 h-12 w-12 rounded-full bg-blue-600 p-3 text-white"
          onClick={() => setShowModal(true)}
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}
