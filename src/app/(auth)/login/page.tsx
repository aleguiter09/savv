"use client";
import Link from "next/link";
import { useTransition } from "react";
import { loginUserForm } from "@/modules/auth/actions/user-action";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { LoginUserSchema } from "@/modules/shared/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/ui/field";
import { useToastStore } from "@/modules/shared/ui/toast-store";
import { ToastManager } from "@/modules/shared/ui/Toast/toast-manager";

type Schema = z.infer<typeof LoginUserSchema>;

export default function LoginPage() {
  const t = useTranslations("auth");
  const show = useToastStore((store) => store.show);
  const [pending, startTransition] = useTransition();

  const form = useForm<Schema>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: Schema) {
    startTransition(async () => {
      const res = await loginUserForm(data);

      if (!res.success) {
        show({ type: "error", message: t(res.error ?? "defaultError") });
      }
    });
  }

  return (
    <>
      <h2 className="mt-2 text-3xl font-extrabold">{t("loginTitle")}</h2>
      <div className="mt-4 w-full max-w-md">
        <form
          className="flex flex-col gap-2"
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
          </FieldGroup>

          <Button className="mt-3" loading={pending} type="submit">
            {t("signIn")}
          </Button>

          <p className="mt-3 text-center text-sm">
            {t("signUpMessage")}
            <Link href="/register" className="font-medium text-blue-600">
              {t("signUp")}
            </Link>
          </p>

          <p className="text-center text-sm">
            {t("forgotPassword")}
            <Link href="/reset" className="font-medium text-blue-600">
              {t("resetPassword")}
            </Link>
          </p>
        </form>
      </div>
      <ToastManager />
    </>
  );
}
