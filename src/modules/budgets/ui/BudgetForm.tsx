"use client";

import {
  createBudgetForm,
  updateBudgetForm,
} from "@/modules/budgets/actions/budget-actions";
import type { BudgetView } from "@/modules/budgets/types/types";
import { CategoryView } from "@/modules/categories/types/types";
import { CategorySelect } from "@/modules/shared/ui/common/CategorySelect";
import { showToast } from "@/modules/shared/ui/toast";
import { BudgetSchema } from "@/modules/shared/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/ui/field";
import { Input } from "@/ui/input";

type SchemaInput = z.input<typeof BudgetSchema>;
type SchemaOutput = z.infer<typeof BudgetSchema>;

type Props = Readonly<{
  budget?: BudgetView;
  categories: CategoryView[];
  onSuccess?: () => void;
}>;

export function BudgetForm({ budget, categories, onSuccess }: Props) {
  const t = useTranslations("budgets");
  const [pending, startTransition] = useTransition();

  const form = useForm<SchemaInput, any, SchemaOutput>({
    resolver: zodResolver(BudgetSchema),
    mode: "onBlur",
    defaultValues: {
      category_id: budget ? Number(budget.categoryId) : undefined,
      amount: budget?.amount ?? undefined,
    },
  });

  function onSubmit(data: SchemaOutput) {
    startTransition(async () => {
      let res;

      if (budget?.id) {
        res = await updateBudgetForm(Number(budget.id), data);
      } else {
        res = await createBudgetForm(data);
      }

      if (res.success) {
        showToast({
          type: "success",
          message: t(budget?.id ? "updatedSuccess" : "createdSuccess"),
        });
        onSuccess?.();
      } else {
        showToast({ type: "error", message: t(res.error ?? "defaultError") });
      }
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-2"
    >
      <FieldGroup className="mb-2">
        <Controller
          control={form.control}
          name="category_id"
          render={({ field, fieldState }) => (
            <CategorySelect
              categories={categories}
              category={field.value?.toString() ?? ""}
              setCategory={(value) => field.onChange(Number(value))}
              label="budgets.chooseCategory"
              disabled={Boolean(budget)}
              error={
                fieldState.invalid
                  ? t(fieldState.error?.message as string)
                  : undefined
              }
            />
          )}
        />

        <Controller
          name="amount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="amount">{t("monthlyLimit")}</FieldLabel>
              <Input
                {...field}
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder={t("enterAmount")}
                value={(field.value as string | number) ?? ""}
                onChange={field.onChange}
              />
              {fieldState.invalid && (
                <FieldError error={t(fieldState.error?.message as string)} />
              )}
            </Field>
          )}
        />
      </FieldGroup>

      <Button loading={pending} type="submit">
        {budget ? t("editBudget") : t("createBudget")}
      </Button>
    </form>
  );
}
