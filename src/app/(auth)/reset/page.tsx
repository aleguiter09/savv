"use client";
import Link from "next/link";
import { useTransition } from "react";
import { useFormState } from "react-dom";
import { resetPasswordForm } from "@/utils/actions/user-action";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";

export default function Reset() {
  const t = useTranslations("auth");
  const [pending, startTransition] = useTransition();
  const [state, dispatch] = useFormState(resetPasswordForm, {
    message: null,
    errors: {},
  });

  const { errors, message } = state;

  const submit = (formData: FormData) => {
    startTransition(() => {
      dispatch(formData);
    });
  };

  return (
    <>
      <h2 className="mt-2 text-3xl font-extrabold">{t("resetTitle")}</h2>
      <div className="mt-4 w-full max-w-md">
        <form className="flex flex-col gap-2" action={submit}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            tabIndex={0}
            className="bg-white shadow-xs"
            label={t("email")}
            error={errors?.email?.[0] && t(errors.email[0])}
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
              className="mt-2 w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white focus:outline-hidden focus:ring-3 focus:ring-gray-blue"
              type="submit"
            >
              {t("reset")}
            </button>
          )}

          <p className="mt-2 text-center text-sm">
            {t("signInMessage")}
            <Link href="/" className="font-medium text-blue-600">
              {t("signIn")}
            </Link>
          </p>

          {message && (
            <p className="text-sm text-center mt-3 text-green-700">
              {t(message)}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
