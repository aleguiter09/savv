"use client";
import Link from "next/link";
import { useTransition } from "react";
import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";
import { updatePasswordForm } from "@/utils/user-action";

export default function UpdatePassword() {
  const t = useTranslations("auth");
  const [pending, startTransition] = useTransition();
  const [state, dispatch] = useFormState(updatePasswordForm, {
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
      <h2 className="mt-2 text-3xl font-extrabold">{t("updateTitle")}</h2>
      <div className="mt-8 w-full max-w-md">
        <form className="flex flex-col gap-2" action={submit}>
          <label htmlFor="password" className="text-sm font-medium">
            {t("password")}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            tabIndex={0}
            className={`rounded-md border p-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600
              ${errors?.password ? "border-red-500" : ""}`}
          />
          {errors?.password && (
            <div id="password-error" aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500">
                {errors.password
                  ? t(errors?.password.at(0) as string)
                  : undefined}
              </p>
            </div>
          )}

          <label htmlFor="confirmPassword" className="text-sm font-medium mt-2">
            {t("confirmPassword")}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            tabIndex={0}
            className={`rounded-md border p-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600
            ${errors?.confirmPassword ? "border-red-500" : ""}`}
          />

          {errors?.confirmPassword && (
            <div id="password-error" aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500">
                {errors.confirmPassword
                  ? t(errors.confirmPassword.at(0) as string)
                  : undefined}
              </p>
            </div>
          )}

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
              className="mt-2 w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white focus:outline-none focus:ring focus:ring-gray-blue"
              type="submit"
            >
              {t("reset")}
            </button>
          )}

          <p className="mt-2 text-center text-sm">
            {t("signInMessage")}
            <Link href="/login" className="font-semibold text-blue-600">
              {t("signIn")}
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
