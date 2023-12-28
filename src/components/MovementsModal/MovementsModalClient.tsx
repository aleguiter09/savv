"use client";
import { useState } from "react";
import { CATEGORY_ICONS } from "@/utils/constants";
import Icon from "@mdi/react";
import { useSupabase } from "@/context/supabaseContext";
import {
  Card,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  NumberInput,
  TextInput,
  DatePicker,
} from "@tremor/react";
import { CurrencyDollarIcon } from "@heroicons/react/outline";
import { insertMovement, upsertBalanceByMonthYear } from "@/services/database";
import { useRouter } from "next/navigation";
import { MovementsModalProps } from "@/types/components";
import { Movement } from "@/types/database";
import { MovementFormFields } from "@/types/general";

export default function MovementsModalClient({
  expenseCategories,
  incomeCategories,
}: Readonly<MovementsModalProps>) {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [movement, setMovement] = useState<Movement>({
    category: null,
    amount: 0,
    type: "expense",
    paid_with: "cash",
    comment: "",
    done_at: new Date().toISOString(),
  });

  const handleConfirm = async () => {
    try {
      if (supabase) {
        await insertMovement(supabase, movement);
        await upsertBalanceByMonthYear(
          supabase,
          new Date(movement.done_at).getMonth(),
          new Date(movement.done_at).getFullYear(),
          movement.amount,
          movement.type,
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      router.refresh();
      router.push("/");
    }
  };

  const handleChange = (
    field: MovementFormFields,
    value: string | number | Date | undefined,
  ) => {
    switch (field) {
      case "done_at":
        setMovement((prevData) => ({
          ...prevData,
          [field]: (value as Date).toISOString(),
        }));
        break;
      case "type":
        setMovement((prevData) => ({
          ...prevData,
          [field]: value === 0 ? "expense" : "income",
        }));
        break;
      default:
        setMovement((prevData) => ({ ...prevData, [field]: value }));
        break;
    }
  };

  const disableConfirm = () => {
    return (
      !movement.category ||
      !movement.amount ||
      !movement.comment ||
      !movement.done_at ||
      !movement.paid_with
    );
  };

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-full w-full bg-gray-600 bg-opacity-50">
      <div className="mx-5 mt-10 flex max-w-sm sm:mx-auto">
        <Card className="p-3">
          <DatePicker
            className="mb-3"
            value={new Date(movement.done_at)}
            onValueChange={(d) => handleChange("done_at", d)}
          />
          <TabGroup
            className="mb-3"
            onIndexChange={(i) => handleChange("type", i)}
          >
            <TabList variant="solid" className="mb-2 w-full">
              <Tab className="w-full place-content-center">Expenses</Tab>
              <Tab className="w-full place-content-center">Incomes</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className="grid grid-cols-4 gap-2">
                  {expenseCategories.map((cat) => {
                    return (
                      <button
                        key={cat.id}
                        className="flex flex-col items-center"
                        onClick={() => handleChange("category", cat.id)}
                      >
                        <Icon
                          className={`bg-${
                            cat.color
                          } mx-auto rounded-full p-1.5 ${
                            cat.id === movement.category
                              ? "border-2 border-slate-600"
                              : ""
                          }`}
                          path={CATEGORY_ICONS[cat.icon]}
                          size={"35px"}
                          color="white"
                        />
                        <p className="m-0 mt-2 truncate text-xs">{cat.title}</p>
                      </button>
                    );
                  })}
                </div>
              </TabPanel>
              <TabPanel>
                <div className="grid grid-cols-4 gap-2">
                  {incomeCategories.map((cat) => {
                    return (
                      <button
                        key={cat.id}
                        className="flex flex-col text-center"
                        onClick={() => handleChange("category", cat.id)}
                      >
                        <Icon
                          className={`bg-${
                            cat.color
                          } mx-auto rounded-full p-1.5 ${
                            cat.id === movement.category
                              ? "border-2 border-slate-600"
                              : ""
                          }`}
                          path={CATEGORY_ICONS[cat.icon]}
                          size={"40px"}
                          color="white"
                        />
                        <p className="m-0 mt-2 truncate text-xs">{cat.title}</p>
                      </button>
                    );
                  })}
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
          <NumberInput
            icon={CurrencyDollarIcon}
            className="mb-3"
            placeholder="Amount..."
            step="10"
            min="0"
            onValueChange={(a) => handleChange("amount", a)}
          />
          <TextInput
            placeholder="Comment..."
            className="mb-3"
            value={movement.comment}
            onChange={(e) => handleChange("comment", e.target.value)}
          />
          <div className="mx-1 flex flex-row gap-2">
            <div className="flex w-full items-center">
              <input
                type="radio"
                value="cash"
                checked={movement.paid_with === "cash"}
                onChange={() => handleChange("paid_with", "cash")}
                className="h-4 w-4 bg-gray-100 text-blue-600  focus:ring-blue-500"
              />
              <label
                htmlFor="cash"
                className="ml-2 text-sm font-medium text-black"
              >
                Debit / Cash
              </label>
            </div>
            <div className="flex w-full items-center">
              <input
                type="radio"
                value="credit"
                checked={movement.paid_with === "credit"}
                onChange={() => handleChange("paid_with", "credit")}
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="credit"
                className="ml-2 text-sm font-medium text-black"
              >
                Credit
              </label>
            </div>
          </div>
          <div className="mt-3 flex flex-row gap-2">
            <button
              className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-60"
              onClick={router.back}
            >
              Close
            </button>
            <button
              className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-60"
              onClick={handleConfirm}
              disabled={disableConfirm()}
            >
              Confirm
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
