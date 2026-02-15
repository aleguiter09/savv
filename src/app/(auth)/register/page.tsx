"use client";
import Link from "next/link";
import { useTransition } from "react";
import { createUserForm } from "@/modules/auth/actions/user-action";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { useToastStore } from "@/modules/shared/ui/toast-store";
import { UserSchema } from "@/modules/shared/utils/schemas";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";

type Schema = z.infer<typeof UserSchema>;

export default function Register() {
  const t = useTranslations("auth");
  const show = useToastStore((store) => store.show);
  const [pending, startTransition] = useTransition();

  const form = useForm<Schema>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: Schema) {
    startTransition(async () => {
      const res = await createUserForm(data);

      if (!res.success) {
        show({ type: "error", message: t(res.error ?? "defaultError") });
      }
    });
  }

  return (
    <>
      <h2 className="mt-2 text-3xl font-extrabold">{t("signUp")}</h2>
      <div className="mt-4 w-full max-w-md">
        <form
          className="flex flex-col gap-1"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    type="email"
                    autoComplete="email"
                    className="bg-white shadow-xs"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      error={t(fieldState.error?.message as string)}
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    aria-invalid={fieldState.invalid}
                    type="password"
                    autoComplete="current-password"
                    className="bg-white shadow-xs"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      error={t(fieldState.error?.message as string)}
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">
                    {t("confirmPassword")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="confirmPassword"
                    aria-invalid={fieldState.invalid}
                    type="password"
                    autoComplete="current-password"
                    className="bg-white shadow-xs"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      error={t(fieldState.error?.message as string)}
                    />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button className="mt-4" loading={pending} type="submit">
            {t("signUp")}
          </Button>

          <p className="mt-2 text-center text-sm">
            {t("signInMessage")}
            <Link href="/" className="font-medium text-blue-600">
              {t("signIn")}
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
