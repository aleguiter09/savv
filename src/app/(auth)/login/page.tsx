"use client";
import Link from "next/link";
import { useTransition } from "react";
import { useFormState } from "react-dom";
import { loginUserForm } from "@/utils/actions/user-action";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const t = useTranslations("auth");
  const [pending, startTransition] = useTransition();
  const [state, dispatch] = useFormState(loginUserForm, {
    message: null,
    errors: {},
  });

  const { errors } = state;

  const submit = (formData: FormData) => {
    startTransition(() => {
      dispatch(formData);
    });
  };

  return (
    <>
      <h2 className="mt-2 text-3xl font-extrabold">{t("loginTitle")}</h2>
      <div className="mt-4 w-full max-w-md">
        <form className="flex flex-col gap-2" action={submit}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="bg-white shadow-xs"
            label={t("email")}
            error={errors?.email?.[0] && t(errors.email[0])}
          />

          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            tabIndex={0}
            className="bg-white shadow-xs"
            label={t("password")}
            error={errors?.password?.[0] && t(errors.password[0])}
          />

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
    </>
  );
}
