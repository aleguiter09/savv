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
import { useLocale, useTranslations } from "next-intl";
import { enUS, es } from "date-fns/locale";

export default function AddMovementForm() {
  const { accounts } = useData();
  const defaultAcc = accounts.find((a) => a.default);

  const [state, dispatch] = useFormState(addMovementForm, {
    message: null,
    errors: {},
  });
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

type FormProps = {
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
}: Readonly<FormProps>) => {
  const t = useTranslations("movements");
  const locale = useLocale();
  const { pending } = useFormStatus();
  const { incomeCategories, expenseCategories } = useData();
  const { errors } = state;

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
      {/* done_at */}
      <label htmlFor="date" className="mb-2 block text-sm font-medium">
        {t("enterDate")}
      </label>
      <DatePicker
        id="date"
        className="mb-3"
        value={date}
        locale={locale.includes("es") ? es : enUS}
        onValueChange={(v) => setDate(v)}
        enableClear={false}
      />
      {/* type/category */}
      <div className="rounded-md mb-4">
        <TabGroup className="mb-3" onIndexChange={(i) => handleTypeChange(i)}>
          <TabList className="w-full">
            <Tab className="w-full place-content-center">{t("expense")}</Tab>
            <Tab className="w-full place-content-center">{t("income")}</Tab>
            <Tab className="w-full place-content-center">{t("transfer")}</Tab>
          </TabList>
          <TabPanels className="mt-3">
            <TabPanel>
              <AccountSelect
                label={t("chooseAccount")}
                accounts={accounts}
                from={from}
                setFrom={setFrom}
                error={!!errors?.from}
                errorMessage={
                  errors?.from ? t(errors?.from?.at(0) as string) : undefined
                }
              />
              <CategorySelect
                categories={expenseCategories}
                category={category}
                setCategory={setCategory}
                error={!!errors?.category}
                errorMessage={
                  errors?.category
                    ? t(errors?.category?.at(0) as string)
                    : undefined
                }
              />
            </TabPanel>
            <TabPanel>
              <AccountSelect
                label={t("chooseAccount")}
                accounts={accounts}
                from={from}
                setFrom={setFrom}
                error={!!errors?.from}
                errorMessage={
                  errors?.from ? t(errors?.from?.at(0) as string) : undefined
                }
              />
              <CategorySelect
                categories={incomeCategories}
                category={category}
                setCategory={setCategory}
                error={!!errors?.category}
                errorMessage={
                  errors?.category
                    ? t(errors?.category?.at(0) as string)
                    : undefined
                }
              />
            </TabPanel>
            <TabPanel>
              <AccountSelect
                label={t("chooseFrom")}
                accounts={accounts.filter((a) => a.id !== Number(where))}
                from={from}
                setFrom={setFrom}
                error={!!errors?.from}
                errorMessage={
                  errors?.from ? t(errors?.from?.at(0) as string) : undefined
                }
              />
              <AccountSelect
                label={t("chooseTo")}
                accounts={accounts.filter((a) => a.id !== Number(from))}
                from={where}
                setFrom={setWhere}
                error={!!errors?.where}
                errorMessage={
                  errors?.where ? t(errors?.where?.at(0) as string) : undefined
                }
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>

      {/* amount */}
      <label htmlFor="amount" className="mb-2 block text-sm font-medium">
        {t("enterAmount")}
      </label>
      <NumberInput
        id="amount"
        name="amount"
        icon={CurrencyDollarIcon}
        placeholder={t("chooseAmount")}
        enableStepper={false}
        step="0.01"
        min="0"
        error={!!errors?.amount}
        errorMessage={
          errors?.amount ? t(errors?.amount?.at(0) as string) : undefined
        }
      />
      {/* comment */}
      <label htmlFor="comment" className="mt-2 mb-2 block text-sm font-medium">
        {t("enterComment")}
      </label>
      <TextInput
        id="comment"
        name="comment"
        placeholder={t("chooseComment")}
        error={!!errors?.comment}
        errorMessage={
          errors?.comment ? t(errors?.comment?.at(0) as string) : undefined
        }
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
            {t("confirm")}
          </button>
        )}
      </div>
    </Card>
  );
};
