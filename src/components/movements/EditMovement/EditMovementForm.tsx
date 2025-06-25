"use client";
import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  DatePicker,
  DatePickerValue,
} from "@tremor/react";
import { useFormState, useFormStatus } from "react-dom";
import { updateMovementForm } from "@/utils/actions/movement-action";
import { useState } from "react";
import { FormMovementState, Type } from "@/types/general";
import { Movement } from "@/types/database";
import { useData } from "@/providers/DataProvider";
import { useLocale, useTranslations } from "next-intl";
import { enUS, es } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { AccountSelect } from "../AddMovement/AccountSelect";
import { CategorySelect } from "../AddMovement/CategorySelect";
import { Input } from "@/components/ui/input";

type Props = Readonly<{
  movement: Movement;
}>;

export function EditMovementForm({ movement }: Props) {
  const [state, dispatch] = useFormState(updateMovementForm, {
    message: null,
    errors: {},
  });
  const [date, setDate] = useState<DatePickerValue>(new Date(movement.done_at));
  const [type, setType] = useState<Type>(movement.type);
  const [category, setCategory] = useState<string>(
    movement?.category?.toString() ?? ""
  );
  const [from, setFrom] = useState<string>(movement.from.toString());
  const [where, setWhere] = useState<string>(movement.where?.toString() ?? "");

  const submit = (formData: FormData) => {
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
  };

  return (
    <form action={submit}>
      <Form
        movement={movement}
        state={state}
        date={date}
        setDate={setDate}
        type={type}
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
  movement: Movement;
  state: FormMovementState;
  date: DatePickerValue;
  setDate: (date: DatePickerValue) => void;
  type: Type;
  setType: (type: Type) => void;
  category: string;
  setCategory: (category: string) => void;
  from: string;
  setFrom: (from: string) => void;
  where: string;
  setWhere: (where: string) => void;
};

const Form = ({
  movement,
  state,
  date,
  setDate,
  type,
  setType,
  category,
  setCategory,
  from,
  setFrom,
  where,
  setWhere,
}: FormProps) => {
  const t = useTranslations("movements");
  const locale = useLocale();
  const { pending } = useFormStatus();
  const { accounts, incomeCategories, expenseCategories } = useData();
  const { errors } = state;

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

  return (
    <Card className="p-4">
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
        <TabGroup
          index={currentIndex()}
          className="mb-3"
          onIndexChange={(i) => handleTypeChange(i)}
        >
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
                error={errors?.from?.[0] && t(errors.from[0])}
              />
              <CategorySelect
                categories={expenseCategories}
                category={category}
                setCategory={setCategory}
                error={errors?.category?.[0] && t(errors.category[0])}
              />
            </TabPanel>
            <TabPanel>
              <AccountSelect
                label={t("chooseAccount")}
                accounts={accounts}
                from={from}
                setFrom={setFrom}
                error={errors?.from?.[0] && t(errors.from[0])}
              />
              <CategorySelect
                categories={incomeCategories}
                category={category}
                setCategory={setCategory}
                error={errors?.category?.[0] && t(errors.category[0])}
              />
            </TabPanel>
            <TabPanel>
              <AccountSelect
                label={t("chooseFrom")}
                accounts={accounts.filter((a) => a.id !== Number(where))}
                from={from}
                setFrom={setFrom}
                error={errors?.from?.[0] && t(errors.from[0])}
              />
              <AccountSelect
                label={t("chooseTo")}
                accounts={accounts.filter((a) => a.id !== Number(from))}
                from={where}
                setFrom={setWhere}
                error={errors?.where?.[0] && t(errors.where[0])}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>

      {/* amount */}
      <Input
        id="amount"
        name="amount"
        placeholder={t("chooseAmount")}
        step="0.01"
        min="0"
        defaultValue={movement.amount}
        label={t("enterAmount")}
        error={errors?.amount?.[0] && t(errors.amount[0])}
      />

      {/* comment */}
      <Input
        id="comment"
        name="comment"
        placeholder={t("chooseComment")}
        defaultValue={movement.comment}
        label={t("enterComment")}
        error={errors?.comment?.[0] && t(errors.comment[0])}
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
            className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white focus:outline-none focus:ring focus:ring-gray-blue"
            type="submit"
          >
            {t("confirm")}
          </button>
        )}
      </div>
    </Card>
  );
};
