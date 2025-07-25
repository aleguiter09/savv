"use client";
import Link from "next/link";
import { useTransition } from "react";
import { useFormState } from "react-dom";
import { createUserForm } from "@/utils/actions/user-action";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Register() {
  const t = useTranslations("auth");
  const [pending, startTransition] = useTransition();
  const [state, dispatch] = useFormState(createUserForm, {
    message: null,
    errors: {},
  });

  const { errors } = state;

  const submit = (e: FormData) => {
    startTransition(() => {
      dispatch(e);
    });
  };

  return (
    <>
      <h2 className="mt-2 text-3xl font-extrabold">{t("signUp")}</h2>
      <div className="mt-4 w-full max-w-md">
        <form className="flex flex-col gap-1" action={submit}>
          <Input
            id="email"
            name="email"
            type="email"
            tabIndex={0}
            className="bg-white shadow-xs"
            label={t("email")}
            error={errors?.email?.[0] && t(errors.email[0])}
          />

          <Input
            id="password"
            name="password"
            type="password"
            className="bg-white shadow-xs"
            label={t("password")}
            error={errors?.password?.[0] && t(errors.password[0])}
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="bg-white shadow-xs"
            label={t("confirmPassword")}
            error={errors?.confirmPassword?.[0] && t(errors.confirmPassword[0])}
          />

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
