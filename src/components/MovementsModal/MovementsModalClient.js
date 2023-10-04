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
import { insertMovement } from "@/services/database";
import { useRouter } from "next/navigation";

export default function MovementsModalClient({
  expenseCategories,
  incomeCategories,
}) {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState(0);
  const [paidWith, setPaidWith] = useState("cash");
  const [comment, setComment] = useState("");

  const handleConfirm = async () => {
    console.log(router.pathname);
    if (category && amount && paidWith && comment && date) {
      try {
        const newMovement = {
          category,
          amount,
          type: type === 0 ? "expense" : "income",
          paid_with: paidWith,
          comment,
          done_at: date.toISOString(),
        };
        await insertMovement(supabase, newMovement);
      } catch (err) {
        console.error(err);
      } finally {
        router.back();
      }
    } else {
      console.error("Error: Fill out all fields to register");
      router.back();
    }
  };

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-full w-full bg-gray-600 bg-opacity-50">
      <div className="mx-5 mt-10 flex max-w-sm sm:mx-auto">
        <Card className="p-3">
          <DatePicker
            className="mb-3"
            value={date}
            onValueChange={(d) => setDate(d)}
          />
          <TabGroup className="mb-3" onIndexChange={(value) => setType(value)}>
            <TabList variant="solid" className="mb-2 w-full">
              <Tab className="w-full place-content-center">Expenses</Tab>
              <Tab className="w-full place-content-center">Incomes</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className="grid grid-cols-4 gap-2">
                  {expenseCategories.map((cat) => {
                    return (
                      <div key={cat.id} className="flex flex-col text-center">
                        <Icon
                          className={`bg-${
                            cat.color
                          } mx-auto rounded-full p-1.5 ${
                            cat.id === category
                              ? "border-2 border-slate-600"
                              : ""
                          }`}
                          path={CATEGORY_ICONS[cat.icon]}
                          size={"35px"}
                          color="white"
                          onClick={() => setCategory(cat.id)}
                        />
                        <p className="m-0 mt-2 truncate text-xs">{cat.title}</p>
                      </div>
                    );
                  })}
                </div>
              </TabPanel>
              <TabPanel>
                <div className="grid grid-cols-4 gap-2">
                  {incomeCategories.map((cat) => {
                    return (
                      <div key={cat.id} className="flex flex-col text-center">
                        <Icon
                          className={`bg-${
                            cat.color
                          } mx-auto rounded-full p-1.5 ${
                            cat.id === category
                              ? "border-2 border-slate-600"
                              : ""
                          }`}
                          path={CATEGORY_ICONS[cat.icon]}
                          size={"40px"}
                          color="white"
                          onClick={() => setCategory(cat.id)}
                        />
                        <p className="m-0 mt-2 truncate text-xs">{cat.title}</p>
                      </div>
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
            onValueChange={(a) => setAmount(a)}
          />
          <TextInput
            placeholder="Comment..."
            className="mb-3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="mx-1 flex flex-row gap-2">
            <div className="flex w-full items-center">
              <input
                type="radio"
                value="cash"
                checked={paidWith === "cash"}
                onChange={() => setPaidWith("cash")}
                className="h-4 w-4 bg-gray-100 text-blue-600  focus:ring-blue-500"
              />
              <label for="cash" className="ml-2 text-sm font-medium text-black">
                Debit / Cash
              </label>
            </div>
            <div className="flex w-full items-center">
              <input
                type="radio"
                value="credit"
                checked={paidWith === "credit"}
                onChange={() => setPaidWith("credit")}
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
              />
              <label
                for="credit"
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
              disabled={!category || !amount || !paidWith || !comment || !date}
            >
              Confirm
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
