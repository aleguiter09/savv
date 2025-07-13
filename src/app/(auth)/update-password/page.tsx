"use client";
import Link from "next/link";
import { useTransition } from "react";
import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";
import { updatePasswordForm } from "@/utils/actions/user-action";
import { Input } from "@/components/ui/input";

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
      <div className="mt-4 w-full max-w-md">
        <form className="flex flex-col gap-2" action={submit}>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
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
            <Link href="/login" className="font-medium text-blue-600">
              {t("signIn")}
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
