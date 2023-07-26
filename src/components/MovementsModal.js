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
  Select,
  SelectItem,
} from "@tremor/react";
import Button from "./common/CustomButton";
import Input from "./common/CustomInput";

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
    console.log(movement);
    const response = await supabase.from("movement").insert(movement);
    console.log(response);
    return;
  };

  const handleConfirm = async () => {
    const newMovement = {
      category: selectedCategory,
      amount: amount,
      type: type === 0 ? "expense" : "income",
      paid_with: paidWith,
      comment: comment,
    };
    await saveCategory(newMovement);
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
    <div class="fixed top-0 right-0 left-0 bg-gray-600 bg-opacity-50 h-full w-full z-50">
      <div class="flex mx-5 mt-10 max-w-sm sm:mx-auto">
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
                          } rounded-full p-1.5 mx-auto ${
                            cat.id === selectedCategory
                              ? "border-2 border-slate-600"
                              : ""
                          }`}
                          path={CATEGORY_ICONS[cat.icon]}
                          size={"35px"}
                          color="white"
                          onClick={() => setSelectedCategory(cat.id)}
                        />
                        <p className="text-xs m-0 mt-2 truncate">{cat.title}</p>
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
                          } rounded-full p-1.5 mx-auto ${
                            cat.id === selectedCategory
                              ? "border-2 border-slate-600"
                              : ""
                          }`}
                          path={CATEGORY_ICONS[cat.icon]}
                          size={"40px"}
                          color="white"
                          onClick={() => setSelectedCategory(cat.id)}
                        />
                        <p className="text-xs m-0 mt-2 truncate">{cat.title}</p>
                      </div>
                    );
                  })}
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
          <NumberInput
            className="mb-3"
            placeholder="Amount..."
            step="10"
            min="0"
            onValueChange={(value) => setAmount(value)}
          />
          <TextInput
            type="text"
            placeholder="Comment..."
            className="mb-3"
            onChange={(value) => setComment(value)}
          />
          <div class="flex flex-row gap-2 mx-1">
            <div class="flex items-center w-full">
              <input
                id="cash"
                type="radio"
                value="cash"
                checked={paidWith === "cash"}
                onChange={() => setPaidWith("cash")}
                class="w-4 h-4 text-blue-600 bg-gray-100  focus:ring-blue-500"
              />
              <label for="cash" class="ml-2 text-sm font-medium text-gray-700">
                Debit / Cash
              </label>
            </div>
            <div class="flex items-center w-full">
              <input
                id="credit"
                type="radio"
                value="credit"
                checked={paidWith === "credit"}
                onChange={() => setPaidWith("credit")}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                for="radio-2"
                class="ml-2 text-sm font-medium text-gray-700"
              >
                Credit
              </label>
            </div>
          </div>
          <div className="flex flex-row gap-2 mt-3">
            <Button label="Close" onClick={handleClose} />
            <Button label="Confirm" onClick={handleConfirm} disabled={false} />
          </div>
        </Card>
      </div>
    </div>
  );
}
