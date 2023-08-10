import React, { useEffect, useState } from "react";
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
} from "@tremor/react";
import { CurrencyDollarIcon } from "@heroicons/react/outline";

export default function MovementsModal({ closeModal }) {
  const { supabase } = useSupabase();
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState(0);
  const [paidWith, setPaidWith] = useState("cash");
  const [comment, setComment] = useState("");

  const getCategories = async () => {
    let { data } = await supabase
      .from("category")
      .select("id, color, title, icon, for");

    const expCategories = data.filter((c) => c.for === "expense");
    const incCategories = data.filter((c) => c.for === "income");
    setIncomeCategories(incCategories);
    setExpenseCategories(expCategories);
  };

  const saveCategory = async (movement) => {
    try {
      const response = await supabase.from("movement").insert(movement);
      console.log(response);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirm = async () => {
    const newMovement = {
      category: selectedCategory,
      amount: amount,
      type: type === 0 ? "expense" : "income",
      paid_with: paidWith,
      comment: comment,
    };
    console.log(newMovement);
    // await saveCategory(newMovement);
    handleClose();
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setAmount(0);
    setType(0);
    closeModal();
  };

  useEffect(() => {
    getCategories();
  });

  return (
    <div class="fixed left-0 right-0 top-0 z-50 h-full w-full bg-gray-600 bg-opacity-50">
      <div class="mx-5 mt-10 flex max-w-sm sm:mx-auto">
        <Card className="p-3">
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
                            cat.id === selectedCategory
                              ? "border-2 border-slate-600"
                              : ""
                          }`}
                          path={CATEGORY_ICONS[cat.icon]}
                          size={"35px"}
                          color="white"
                          onClick={() => setSelectedCategory(cat.id)}
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
                            cat.id === selectedCategory
                              ? "border-2 border-slate-600"
                              : ""
                          }`}
                          path={CATEGORY_ICONS[cat.icon]}
                          size={"40px"}
                          color="white"
                          onClick={() => setSelectedCategory(cat.id)}
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
          <div class="mx-1 flex flex-row gap-2">
            <div class="flex w-full items-center">
              <input
                type="radio"
                value="cash"
                checked={paidWith === "cash"}
                onChange={() => setPaidWith("cash")}
                class="h-4 w-4 bg-gray-100 text-blue-600  focus:ring-blue-500"
              />
              <label for="cash" class="ml-2 text-sm font-medium text-gray-700">
                Debit / Cash
              </label>
            </div>
            <div class="flex w-full items-center">
              <input
                type="radio"
                value="credit"
                checked={paidWith === "credit"}
                onChange={() => setPaidWith("credit")}
                class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
              />
              <label
                for="radio-2"
                class="ml-2 text-sm font-medium text-gray-700"
              >
                Credit
              </label>
            </div>
          </div>
          <div className="mt-3 flex flex-row gap-2">
            <button
              className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-60"
              onClick={handleClose}
            >
              Close
            </button>
            <button
              className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-60"
              onClick={handleConfirm}
              disabled={true}
            >
              Confirm
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
