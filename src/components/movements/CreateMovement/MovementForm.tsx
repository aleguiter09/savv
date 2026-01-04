"use client";

import type { Movement } from "@/types/global.types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovementSchema } from "@/lib/schemas";
import { useData } from "@/stores/DataProvider";
import { useToastStore } from "@/stores/toast-store";
import {
  createMovementForm,
  updateMovementForm,
} from "@/utils/actions/movement-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { AccountSelect } from "./AccountSelect";
import { CategorySelect } from "./CategorySelect";
import { enUS, es } from "date-fns/locale";
import { Input } from "@/components/ui/input";

type Schema = z.infer<typeof MovementSchema>;

export function MovementForm({ movement }: { movement?: Movement }) {
  const { accounts, incomeCategories, expenseCategories } = useData();
  const defaultAcc = accounts.find((a) => a.is_default);

  const t = useTranslations("movements");
  const locale = useLocale();
  const show = useToastStore((store) => store.show);
  const [pending, startTransition] = useTransition();

  const form = useForm<Schema>({
    resolver: zodResolver(MovementSchema),
    defaultValues: movement
      ? {
          amount: movement.amount,
          comment: movement.comment,
          type: movement.type,
          done_at: new Date(movement.done_at),
          category: movement.category ?? undefined,
          from: movement.from,
          where: movement.where ?? undefined,
        }
      : {
          type: "expense",
          done_at: new Date(),
          from: defaultAcc?.id ?? undefined,
          comment: "",
        },
  });

  const [type, from, where] = form.watch(["type", "from", "where"]);

  useEffect(() => {
    form.resetField("category");
  }, [type, form]);

  function onSubmit(data: Schema) {
    startTransition(async () => {
      let res;
      if (movement?.id) {
        res = await updateMovementForm(movement, data);
      } else {
        res = await createMovementForm(data);
      }

      if (!res.success) {
        show({ type: "error", message: t(res.error ?? "defaultError") });
      }
    });
  }

  const renderFrom = () => (
    <Controller
      name="from"
      control={form.control}
      render={({ field, fieldState }) => (
        <AccountSelect
          label={t("chooseAccount")}
          accounts={accounts.filter((a) => a.id !== where)}
          value={field.value?.toString() ?? ""}
          setValue={field.onChange}
          error={
            fieldState.invalid
              ? t(fieldState.error?.message as string)
              : undefined
          }
        />
      )}
    />
  );

  const renderWhere = () => (
    <Controller
      name="where"
      control={form.control}
      render={({ field, fieldState }) => (
        <AccountSelect
          label={t("chooseTo")}
          accounts={accounts.filter((a) => a.id !== from)}
          value={field.value?.toString() ?? ""}
          setValue={field.onChange}
          error={
            fieldState.invalid
              ? t(fieldState.error?.message as string)
              : undefined
          }
        />
      )}
    />
  );

  const renderCategory = (type: "income" | "expense") => (
    <Controller
      control={form.control}
      name="category"
      render={({ field, fieldState }) => (
        <CategorySelect
          categories={type === "income" ? incomeCategories : expenseCategories}
          category={field.value?.toString() ?? ""}
          setCategory={field.onChange}
          error={
            fieldState.invalid
              ? t(fieldState.error?.message as string)
              : undefined
          }
        />
      )}
    />
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="p-4">
        <FieldGroup>
          {/* done_at */}
          <Controller
            name="done_at"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="block text-sm font-medium">
                  {t("enterDate")}
                </FieldLabel>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  locale={locale.includes("es") ? es : enUS}
                  error={fieldState.error?.message}
                />
              </Field>
            )}
          />

          {/* type/category */}
          <div className="rounded-md ">
            <Controller
              name="type"
              control={form.control}
              render={({ field }) => (
                <Tabs value={type} onValueChange={field.onChange}>
                  <TabsList className="w-full">
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

                  <TabsContent value="expense" className="flex flex-col gap-4">
                    {renderFrom()}
                    {renderCategory("expense")}
                  </TabsContent>
                  <TabsContent value="income" className="flex flex-col gap-4">
                    {renderFrom()}
                    {renderCategory("income")}
                  </TabsContent>
                  <TabsContent value="transfer" className="flex flex-col gap-4">
                    {renderFrom()}
                    {renderWhere()}
                  </TabsContent>
                </Tabs>
              )}
            />
          </div>

          {/* amount */}
          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="amount">{t("enterAmount")}</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id="amount"
                  type="number"
                  aria-invalid={fieldState.invalid}
                  placeholder={t("chooseAmount")}
                  step="0.01"
                  min="0"
                />
                {fieldState.invalid && (
                  <FieldError error={t(fieldState.error?.message as string)} />
                )}
              </Field>
            )}
          />

          {/* comment */}
          <Controller
            name="comment"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="comment">{t("enterComment")}</FieldLabel>
                <Input
                  {...field}
                  id="comment"
                  aria-invalid={fieldState.invalid}
                  placeholder={t("chooseComment")}
                />
                {fieldState.invalid && (
                  <FieldError error={t(fieldState.error?.message as string)} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Actions */}
        <div className="mt-3 flex flex-row gap-2">
          <Button loading={pending} type="submit" className="w-full">
            {t("confirm")}
          </Button>
        </div>
      </Card>
    </form>
  );
}
