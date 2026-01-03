"use client";
import { Account } from "@/types/global.types";
import { useTranslations } from "next-intl";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { AccountSchema } from "@/lib/schemas";
import { z } from "zod";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  createAccountForm,
  updateAccountForm,
} from "@/utils/actions/account-actions";
import { useToastStore } from "@/stores/toast-store";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";

type Props = {
  account?: Account;
};

type Schema = z.infer<typeof AccountSchema>;

export function AccountForm({ account }: Props) {
  const t = useTranslations("accounts");
  const show = useToastStore((store) => store.show);
  const [pending, startTransition] = useTransition();

  const form = useForm<Schema>({
    resolver: zodResolver(AccountSchema),
    mode: "onBlur",
    defaultValues: {
      name: account?.name ?? "",
      balance: account?.balance ?? undefined,
      default: account?.default ?? false,
    },
  });

  function onSubmit(data: Schema) {
    startTransition(async () => {
      let res;

      if (account?.id) {
        res = await updateAccountForm(account, data);
      } else {
        res = await createAccountForm(data);
      }

      if (!res.success) {
        show({ type: "error", message: t(res.error ?? "defaultError") });
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="rounded-md p-4 flex flex-col gap-2">
        <FieldGroup>
          {/* Account name */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="name"
                  className="block text-sm font-medium"
                >
                  {t("enterName")}
                </FieldLabel>
                <Input
                  {...field}
                  id="name"
                  placeholder={t("enterAccountName")}
                  value={field.value}
                />
                {fieldState.invalid && (
                  <FieldError error={t(fieldState.error?.message as string)} />
                )}
              </Field>
            )}
          />

          {/* Account balance */}
          <Controller
            name="balance"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="balance"
                  className="block text-sm font-medium"
                >
                  {t("currentBalance")}
                </FieldLabel>
                <Input
                  {...field}
                  id="balance"
                  placeholder={t("enterBalance")}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  step="0.01"
                  type="number"
                />
                {fieldState.invalid && (
                  <FieldError error={t(fieldState.error?.message as string)} />
                )}
              </Field>
            )}
          />

          {/* Default account */}
          <Controller
            name="default"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                className="flex items-center gap-3 my-2"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel
                  htmlFor="default"
                  className="block text-sm font-medium"
                >
                  {t("defaultAccount")}
                </FieldLabel>
                <Checkbox
                  id="default"
                  name="default"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </Field>
            )}
          />
        </FieldGroup>

        <Button loading={pending} type="submit">
          {account ? t("editAccount") : t("createAccount")}
        </Button>
      </Card>
    </form>
  );
}
