"use client";
import Link from "next/link";
import { useTransition } from "react";
import { useFormState } from "react-dom";
import { loginUserForm } from "@/utils/actions/user-action";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";

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
            className="bg-white shadow-sm"
            label={t("email")}
            error={errors?.email?.[0] && t(errors.email[0])}
          />

          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            tabIndex={0}
            className="bg-white shadow-sm"
            label={t("password")}
            error={errors?.password?.[0] && t(errors.password[0])}
          />

          {pending ? (
            <div className="mt-2 flex w-full justify-center rounded-md bg-blue-600 py-2">
              <output
                className="h-5 w-5 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
                aria-live="polite"
              />
            </div>
          ) : (
            <button
              tabIndex={0}
              className="mt-2 w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white focus:outline-none focus:ring focus:ring-gray-blue"
              type="submit"
            >
              {t("signIn")}
            </button>
          )}
          <p className="mt-4 text-center text-sm">
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
