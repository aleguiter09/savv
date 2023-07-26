"use client";
import Button from "@/components/common/CustomButton";
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
    <div className="max-w-lg h-screen my-5 mx-5 sm:mx-auto">
      {showModal && <MovementsModal closeModal={() => setShowModal(false)} />}
      <Card className="mb-4 flex justify-between py-2 px-3">
        <TremorIcon color="blue" size="sm" icon={ArrowLeftIcon} />
        <h5 className="text-lg mt-1 font-semibold">June 2023</h5>
        <TremorIcon color="blue" size="sm" icon={ArrowRightIcon} />
      </Card>
      <Finances />
      <ExpensesByCat />
      {/*<Button label="Log out" onClick={signOut} />*/}
      <div className="flex justify-center mt-6 fixed bottom-0 left-0 right-0">
        <button
          className="w-12 h-12 p-3 bg-blue-600 rounded-full text-white mb-2"
          onClick={() => setShowModal(true)}
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}
