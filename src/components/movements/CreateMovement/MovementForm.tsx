import { Card } from "@/components/ui/card";
import { useData } from "@/providers/DataProvider";
import { Movement } from "@/types/database";
import { FormMovementState, Type } from "@/types/general";
import { useLocale, useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";
import { enUS, es } from "date-fns/locale";
import { AccountSelect } from "./AccountSelect";
import { CategorySelect } from "./CategorySelect";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

type FormProps = {
  movement?: Movement;
  state: FormMovementState;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  type: Type;
  setType: (type: Type) => void;
  category: string;
  setCategory: (category: string) => void;
  from: string;
  setFrom: (from: string) => void;
  where: string;
  setWhere: (where: string) => void;
};

export const MovementForm = ({
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

  return (
    <Card className="p-4">
      {/* done_at */}
      <label htmlFor="date" className="mb-2 block text-sm font-medium">
        {t("enterDate")}
      </label>
      <DatePicker
        className="mb-3"
        value={date}
        locale={locale.includes("es") ? es : enUS}
        onChange={(v) => setDate(v)}
        error={errors?.done_at?.[0] && t(errors.done_at[0])}
      />
      {/* type/category */}
      <div className="rounded-md mb-2">
        <Tabs
          defaultValue={type}
          onValueChange={(v) => setType(v as Type)}
          className="mb-3"
        >
          <TabsList className="w-full mb-3">
            <TabsTrigger value="expense" className="w-full">
              {t("expense")}
            </TabsTrigger>
            <TabsTrigger value="income" className="w-full">
              {t("income")}
            </TabsTrigger>
            <TabsTrigger value="transfer" className="w-full">
              {t("transfer")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="expense">
            <AccountSelect
              label={t("chooseAccount")}
              accounts={accounts}
              value={from}
              setValue={setFrom}
              error={errors?.from?.[0] && t(errors.from[0])}
            />
            <CategorySelect
              categories={expenseCategories}
              category={category}
              setCategory={setCategory}
              error={errors?.category?.[0] && t(errors.category[0])}
            />
          </TabsContent>
          <TabsContent value="income">
            <AccountSelect
              label={t("chooseAccount")}
              accounts={accounts}
              value={from}
              setValue={setFrom}
              error={errors?.from?.[0] && t(errors.from[0])}
            />
            <CategorySelect
              categories={incomeCategories}
              category={category}
              setCategory={setCategory}
              error={errors?.category?.[0] && t(errors.category[0])}
            />
          </TabsContent>
          <TabsContent value="transfer">
            <AccountSelect
              label={t("chooseFrom")}
              accounts={accounts.filter((a) => a.id !== Number(where))}
              value={from}
              setValue={setFrom}
              error={errors?.from?.[0] && t(errors.from[0])}
            />
            <AccountSelect
              label={t("chooseTo")}
              accounts={accounts.filter((a) => a.id !== Number(from))}
              value={where}
              setValue={setWhere}
              error={errors?.where?.[0] && t(errors.where[0])}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* amount */}
      <Input
        id="amount"
        name="amount"
        type="number"
        placeholder={t("chooseAmount")}
        step="0.01"
        min="0"
        label={t("enterAmount")}
        error={errors?.amount?.[0] && t(errors.amount[0])}
        defaultValue={movement?.amount}
      />

      {/* comment */}
      <Input
        id="comment"
        name="comment"
        placeholder={t("chooseComment")}
        label={t("enterComment")}
        error={errors?.comment?.[0] && t(errors.comment[0])}
        defaultValue={movement?.comment}
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
