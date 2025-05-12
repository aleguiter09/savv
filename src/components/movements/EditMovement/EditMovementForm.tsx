"use client";
import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  NumberInput,
  TextInput,
  DatePicker,
  DatePickerValue,
  Card,
} from "@tremor/react";
import { CurrencyDollarIcon } from "@heroicons/react/outline";
import { useFormState } from "react-dom";
import { updateMovementForm } from "@/utils/movement-action";
import { useState, useTransition } from "react";
import { Type } from "@/types/general";
import AccountSelect from "../AddMovement/AccountSelect";
import CategorySelect from "../AddMovement/CategorySelect";
import { Movement } from "@/types/database";
import { useData } from "@/providers/DataProvider";

type EditMovementFormProps = {
  movement: Movement;
};

export default function EditMovementForm({
  movement,
}: Readonly<EditMovementFormProps>) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(updateMovementForm, initialState);
  const [date, setDate] = useState<DatePickerValue>(new Date(movement.done_at));
  const [type, setType] = useState<Type>(movement.type);
  const [category, setCategory] = useState<string>(
    movement?.category?.toString() ?? ""
  );
  const [from, setFrom] = useState<string>(movement.from.toString());
  const [where, setWhere] = useState<string>(movement.where?.toString() ?? "");
  const [pending, startTransition] = useTransition();
  const { accounts, incomeCategories, expenseCategories } = useData();

  const currentIndex = () => {
    if (type === "expense") {
      return 0;
    } else if (type === "income") {
      return 1;
    } else {
      return 2;
    }
  };

  const handleTypeChange = (i: number) => {
    switch (i) {
      case 0:
        setType("expense");
        break;
      case 1:
        setType("income");
        break;
      case 2:
        setType("transfer");
        break;
    }
  };

  const submit = (formData: FormData) => {
    startTransition(() => {
      formData.set("id", movement.id?.toString() ?? "");
      formData.set("previousAmount", movement.amount.toString());
      formData.set("previousFrom", movement.from.toString());
      formData.set("previousWhere", movement.where?.toString() ?? "");
      formData.set("previousType", movement.type);
      formData.set("done_at", date ? date.toISOString() : "");
      formData.set("type", type);
      formData.set("from", from);
      formData.set("category", category);
      if (type === "transfer") {
        formData.set("where", where);
        formData.delete("category");
      }
      dispatch(formData);
    });
  };

  return (
    <form action={submit}>
      <Card className="rounded-md p-4">
        {/* Movement done_at */}
        <label htmlFor="amount" className="mb-2 block text-sm font-medium">
          Enter date
        </label>
        <DatePicker
          className="mb-3"
          value={date}
          onValueChange={(v) => setDate(v)}
          enableClear={false}
        />
        {/* Movement type/category */}
        <div className="rounded-md mb-4">
          <TabGroup
            index={currentIndex()}
            className="mb-3"
            onIndexChange={(i) => handleTypeChange(i)}
          >
            <TabList className="w-full">
              <Tab className="w-full place-content-center">Expense</Tab>
              <Tab className="w-full place-content-center">Income</Tab>
              <Tab className="w-full place-content-center">Transfer</Tab>
            </TabList>
            <TabPanels className="mt-3">
              <TabPanel>
                <AccountSelect
                  label="Choose account"
                  accounts={accounts}
                  from={from}
                  setFrom={setFrom}
                  error={!!state.errors?.from}
                  errorMessage={state.errors?.from?.at(0)}
                />
                <CategorySelect
                  categories={expenseCategories}
                  category={category}
                  setCategory={setCategory}
                  error={!!state.errors?.category}
                  errorMessage={state.errors?.category?.at(0)}
                />
              </TabPanel>
              <TabPanel>
                <AccountSelect
                  label="Choose account"
                  accounts={accounts}
                  from={from}
                  setFrom={setFrom}
                  error={!!state.errors?.from}
                  errorMessage={state.errors?.from?.at(0)}
                />
                <CategorySelect
                  categories={incomeCategories}
                  category={category}
                  setCategory={setCategory}
                  error={!!state.errors?.category}
                  errorMessage={state.errors?.category?.at(0)}
                />
              </TabPanel>
              <TabPanel>
                <AccountSelect
                  label="Choose from where you will transfer"
                  accounts={accounts}
                  from={from}
                  setFrom={setFrom}
                  error={!!state.errors?.from}
                  errorMessage={state.errors?.from?.at(0)}
                />
                <AccountSelect
                  label="Choose where you will transfer"
                  accounts={accounts}
                  from={where}
                  setFrom={setWhere}
                  error={!!state.errors?.where}
                  errorMessage={state.errors?.where?.at(0)}
                />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>

        {/* Movement amount */}
        <label htmlFor="amount" className="mb-2 block text-sm font-medium">
          Enter amount
        </label>
        <NumberInput
          id="amount"
          name="amount"
          icon={CurrencyDollarIcon}
          placeholder="Amount..."
          enableStepper={false}
          step="0.01"
          min="0"
          defaultValue={movement.amount}
          error={!!state.errors?.amount}
          errorMessage={state.errors?.amount?.at(0)}
        />
        {/* Movement comment */}
        <label
          htmlFor="comment"
          className="mt-2 mb-2 block text-sm font-medium"
        >
          Enter comment
        </label>
        <TextInput
          id="comment"
          name="comment"
          placeholder="Comment..."
          defaultValue={movement.comment}
          error={!!state.errors?.comment}
          errorMessage={state.errors?.comment?.at(0)}
        />
        {/* Actions */}
        <div className="mt-3 flex flex-row gap-2">
          {pending ? (
            <div className="flex w-full justify-center rounded-md bg-blue-600 py-2">
              <output
                className="h-5 w-5 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
                aria-live="polite"
              />
            </div>
          ) : (
            <button
              tabIndex={0}
              className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white focus:outline-none focus:ring focus:ring-gray-blue"
              type="submit"
            >
              Confirm
            </button>
          )}
        </div>
      </Card>
    </form>
  );
}
