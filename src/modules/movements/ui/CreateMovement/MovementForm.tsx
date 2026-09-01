"use client";

import { Button } from "@/ui/button";
import { DatePicker } from "@/ui/date-picker";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { MovementSchema } from "@/modules/shared/utils/schemas";
import { useData } from "@/modules/shared/stores/DataProvider";
import { showToast } from "@/modules/shared/ui/toast";
import {
  createMovementForm,
  updateMovementForm,
} from "@/modules/movements/actions/movement-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useMemo, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { AccountSelect } from "@/modules/shared/ui/common/AccountSelect";
import { CategorySelect } from "@/modules/shared/ui/common/CategorySelect";
import { getDateFnsLocale } from "@/modules/shared/utils/dateFnsLocale";
import { Input } from "@/ui/input";
import { MovementView } from "../../types/types";

type SchemaInput = z.input<typeof MovementSchema>;
type SchemaOutput = z.infer<typeof MovementSchema>;

type MovementFormProps = {
  movement?: MovementView;
  onSuccess?: () => void;
};

export function MovementForm({
  movement,
  onSuccess,
}: Readonly<MovementFormProps>) {
  const { accounts, incomeCategories, expenseCategories } = useData();

  const t = useTranslations("movements");
  const locale = useLocale();
  const [pending, startTransition] = useTransition();

  const form = useForm<SchemaInput, unknown, SchemaOutput>({
    resolver: zodResolver(MovementSchema),
    defaultValues: movement
      ? {
          amount: Math.abs(movement.amount),
          description: movement.description,
          type: movement.type,
          schedule: "once",
          done_at: new Date(movement.doneAt),
          category: movement.category?.id ?? undefined,
          from: movement.account?.id ?? undefined,
          ...(movement.type === "transfer"
            ? { where: movement.toAccount?.id ?? undefined }
            : {}),
        }
      : {
          type: "expense",
          schedule: "once",
          done_at: new Date(),
          description: "",
        },
  });

  const type = useWatch({ control: form.control, name: "type" });
  const from = useWatch({ control: form.control, name: "from" });
  const where = useWatch({ control: form.control, name: "where" });
  const schedule = useWatch({ control: form.control, name: "schedule" });
  const amount = useWatch({ control: form.control, name: "amount" });
  const installmentCount = useWatch({
    control: form.control,
    name: "installment_count",
  });

  useEffect(() => {
    form.resetField("category");
    if (type !== "expense") {
      form.setValue("schedule", "once");
    }
  }, [type, form]);

  const installmentPreview = useMemo(() => {
    const total = Number(amount);
    const count = Number(installmentCount);
    if (!total || !count || count < 2) return null;
    const per = Math.floor((total * 100) / count) / 100;
    return { count, per };
  }, [amount, installmentCount]);

  function onSubmit(data: SchemaOutput) {
    startTransition(async () => {
      let res;
      if (movement?.id) {
        res = await updateMovementForm(movement, data);
      } else {
        res = await createMovementForm(data);
      }

      if (res.success) {
        showToast({
          type: "success",
          message: t(movement?.id ? "updatedSuccess" : "createdSuccess"),
        });
        onSuccess?.();
      } else {
        showToast({ type: "error", message: t(res.error ?? "defaultError") });
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

  const renderCategory = (kind: "income" | "expense") => (
    <Controller
      control={form.control}
      name="category"
      render={({ field, fieldState }) => (
        <CategorySelect
          categories={kind === "income" ? incomeCategories : expenseCategories}
          category={field.value?.toString() ?? ""}
          label={t("movements.chooseCategory")}
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
      <FieldGroup>
        <Controller
          name="done_at"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="block text-sm font-medium">
                {schedule === "installment"
                  ? t("firstInstallmentDate")
                  : schedule === "recurring"
                    ? t("startDate")
                    : t("enterDate")}
              </FieldLabel>
              <DatePicker
                value={field.value as Date | undefined}
                onChange={field.onChange}
                locale={getDateFnsLocale(locale)}
                error={fieldState.error?.message}
              />
            </Field>
          )}
        />

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
                  {!movement ? (
                    <Controller
                      name="schedule"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>{t("scheduleType")}</FieldLabel>
                          <Tabs
                            value={field.value ?? "once"}
                            onValueChange={field.onChange}
                          >
                            <TabsList className="w-full">
                              <TabsTrigger value="once" className="w-full">
                                {t("scheduleOnce")}
                              </TabsTrigger>
                              <TabsTrigger value="recurring" className="w-full">
                                {t("scheduleRecurring")}
                              </TabsTrigger>
                              <TabsTrigger
                                value="installment"
                                className="w-full"
                              >
                                {t("scheduleInstallment")}
                              </TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </Field>
                      )}
                    />
                  ) : null}

                  {schedule === "recurring" && !movement ? (
                    <>
                      <Controller
                        name="frequency"
                        control={form.control}
                        defaultValue="monthly"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="frequency">
                              {t("frequency")}
                            </FieldLabel>
                            <select
                              {...field}
                              id="frequency"
                              className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                              value={field.value ?? "monthly"}
                            >
                              <option value="weekly">{t("freqWeekly")}</option>
                              <option value="biweekly">
                                {t("freqBiweekly")}
                              </option>
                              <option value="monthly">
                                {t("freqMonthly")}
                              </option>
                              <option value="yearly">{t("freqYearly")}</option>
                            </select>
                            {fieldState.invalid && (
                              <FieldError
                                error={t(fieldState.error?.message as string)}
                              />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="end_date"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>{t("endDateOptional")}</FieldLabel>
                            <DatePicker
                              value={
                                field.value instanceof Date &&
                                !Number.isNaN(field.value.getTime())
                                  ? field.value
                                  : undefined
                              }
                              onChange={(date) =>
                                field.onChange(date ?? null)
                              }
                              locale={getDateFnsLocale(locale)}
                              error={
                                fieldState.invalid
                                  ? t(fieldState.error?.message as string)
                                  : undefined
                              }
                            />
                          </Field>
                        )}
                      />
                    </>
                  ) : null}

                  {schedule === "installment" && !movement ? (
                    <Controller
                      name="installment_count"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="installment_count">
                            {t("installmentCount")}
                          </FieldLabel>
                          <Input
                            {...field}
                            value={(field.value as string | number) ?? ""}
                            id="installment_count"
                            type="number"
                            min={2}
                            max={60}
                            step={1}
                            placeholder="12"
                          />
                          {installmentPreview ? (
                            <p className="text-muted-foreground text-xs">
                              {t("installmentPreview", {
                                count: installmentPreview.count,
                                amount: installmentPreview.per.toFixed(2),
                              })}
                            </p>
                          ) : null}
                          {fieldState.invalid && (
                            <FieldError
                              error={t(fieldState.error?.message as string)}
                            />
                          )}
                        </Field>
                      )}
                    />
                  ) : null}

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

        <Controller
          name="amount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="amount">
                {schedule === "installment" && !movement
                  ? t("enterTotalAmount")
                  : t("enterAmount")}
              </FieldLabel>
              <Input
                {...field}
                value={(field.value as string | number) ?? ""}
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

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">
                {t("enterDescription")}
              </FieldLabel>
              <Input
                {...field}
                id="description"
                aria-invalid={fieldState.invalid}
                placeholder={t("chooseDescription")}
              />
              {fieldState.invalid && (
                <FieldError error={t(fieldState.error?.message as string)} />
              )}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="mt-3 flex flex-row gap-2">
        <Button loading={pending} type="submit" className="w-full">
          {t("confirm")}
        </Button>
      </div>
    </form>
  );
}
