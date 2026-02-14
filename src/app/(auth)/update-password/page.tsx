"use client";
import Link from "next/link";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { updatePasswordForm } from "@/modules/auth/actions/user-action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToastStore } from "@/stores/toast-store";
import { UpdatePasswordSchema } from "@/lib/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

type Schema = z.infer<typeof UpdatePasswordSchema>;

export default function UpdatePassword() {
  const t = useTranslations("auth");
  const show = useToastStore((store) => store.show);
  const [pending, startTransition] = useTransition();

  const form = useForm<Schema>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: Schema) {
    startTransition(async () => {
      const res = await updatePasswordForm(data);

      if (!res.success) {
        show({ type: "error", message: t("resetSent") });
      }
    });
  }

  return (
    <>
      <h2 className="mt-2 text-3xl font-extrabold">{t("updateTitle")}</h2>
      <div className="mt-4 w-full max-w-md">
        <form
          className="flex flex-col gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
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

          <Button className="mt-2" loading={pending} type="submit">
            {t("reset")}
          </Button>

          <p className="mt-2 text-center text-sm">
            {t("signInMessage")}
            <Link href="/login" className="font-medium text-blue-600">
              {t("signIn")}
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
