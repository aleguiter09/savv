"use client";
import { useFormState, useFormStatus } from "react-dom";
import { addMovementForm } from "@/utils/movement-action";
import { useState } from "react";
import { CurrencyDollarIcon } from "@heroicons/react/outline";
import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  NumberInput,
  TextInput,
  DatePicker,
  Card,
  DatePickerValue,
} from "@tremor/react";
import CategorySelect from "./CategorySelect";
import AccountSelect from "./AccountSelect";
import { useData } from "@/providers/DataProvider";
import { FormMovementState, Type } from "@/types/general";
import { Account } from "@/types/database";

export default function AddMovementForm() {
  const { accounts } = useData();
  const defaultAcc = accounts.find((a) => a.default);

  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(addMovementForm, initialState);

  const [date, setDate] = useState<DatePickerValue>(new Date());
  const [type, setType] = useState<Type>("expense");
  const [category, setCategory] = useState<string>("");
  const [from, setFrom] = useState<string>(defaultAcc?.id?.toString() ?? "");
  const [where, setWhere] = useState<string>("");

  const submit = (formData: FormData) => {
    formData.set("done_at", date ? date.toISOString() : "");
    formData.set("type", type);
    formData.set("from", from);
    formData.set("category", category);

    if (type === "transfer") {
      formData.set("where", where);
      formData.delete("category");
    }

    dispatch(formData);
  };

  return (
    <form action={submit}>
      <Form
        accounts={accounts}
        state={state}
        date={date}
        setDate={setDate}
        setType={setType}
        category={category}
        setCategory={setCategory}
        from={from}
        setFrom={setFrom}
        where={where}
        setWhere={setWhere}
      />
    </form>
  );
}

type AddMovementFormClientProps = {
  accounts: Account[];
  state: FormMovementState;
  date: DatePickerValue;
  setDate: (date: DatePickerValue) => void;
  setType: (type: Type) => void;
  category: string;
  setCategory: (category: string) => void;
  from: string;
  setFrom: (from: string) => void;
  where: string;
  setWhere: (where: string) => void;
};

const Form = ({
  accounts,
  state,
  date,
  setDate,
  setType,
  category,
  setCategory,
  from,
  setFrom,
  where,
  setWhere,
}: Readonly<AddMovementFormClientProps>) => {
  const { incomeCategories, expenseCategories } = useData();
  const { pending } = useFormStatus();

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

  return (
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
        <TabGroup className="mb-3" onIndexChange={(i) => handleTypeChange(i)}>
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
                accounts={accounts.filter((a) => a.id !== Number(where))}
                from={from}
                setFrom={setFrom}
                error={!!state.errors?.from}
                errorMessage={state.errors?.from?.at(0)}
              />
              <AccountSelect
                label="Choose where you will transfer"
                accounts={accounts.filter((a) => a.id !== Number(from))}
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
        error={!!state.errors?.amount}
        errorMessage={state.errors?.amount?.at(0)}
      />
      {/* Movement comment */}
      <label htmlFor="comment" className="mt-2 mb-2 block text-sm font-medium">
        Enter comment
      </label>
      <TextInput
        id="comment"
        name="comment"
        placeholder="Comment..."
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
            className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white focus:outline-none focus:ring focus:ring-gray-blue"
            type="submit"
          >
            Confirm
          </button>
        )}
      </div>
    </Card>
  );
};
