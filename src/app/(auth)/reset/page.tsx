"use client";
import Link from "next/link";
import { useTransition } from "react";
import { useFormState } from "react-dom";
import { resetPasswordForm } from "@/utils/user-action";
import { useTranslations } from "next-intl";

export default function Reset() {
  const t = useTranslations("auth");
  const initialState = { message: null, errors: {} };
  const [pending, startTransition] = useTransition();
  const [state, dispatch] = useFormState(resetPasswordForm, initialState);

  const submit = (formData: FormData) => {
    startTransition(() => {
      dispatch(formData);
    });
  };

  return (
    <>
      <h2 className="mt-2 text-3xl font-extrabold">{t("resetTitle")}</h2>
      <div className="mt-8 w-full max-w-md">
        <form className="flex flex-col gap-2" action={submit}>
          <label htmlFor="email" className="text-sm font-medium">
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            tabIndex={0}
            className={`rounded-md border p-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600
            ${state?.errors?.email ? "border-red-500" : ""}`}
          />
          {state?.errors?.email && (
            <div id="email-error" aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500">
                {state.errors.email
                  ? t(state.errors.email.at(0) as string)
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
            <Link href="/" className="font-semibold text-blue-600">
              {t("signIn")}
            </Link>
          </p>

          {state.message && (
            <p className="text-sm text-center mt-3 text-green-700">
              {t(state.message)}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
