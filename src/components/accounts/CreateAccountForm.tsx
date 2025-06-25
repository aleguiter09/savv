"use client";

import { createAccountForm } from "@/utils/actions/account-actions";
import { useFormState, useFormStatus } from "react-dom";
import { FormAccountState } from "@/types/general";
import { useTranslations } from "next-intl";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

export function CreateAccountForm() {
  const [state, dispatch] = useFormState(createAccountForm, {
    message: null,
    errors: {},
  });

  return (
    <form action={dispatch}>
      <Form state={state} />
    </form>
  );
}

const Form = ({ state }: { state: FormAccountState }) => {
  const t = useTranslations("accounts");
  const { errors } = state;
  const { pending } = useFormStatus();

  return (
    <Card className="rounded-md p-4">
      {/* Account name */}
      <div className="mb-4">
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          {t("enterName")}
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <Input
              id="name"
              name="name"
              placeholder={t("enterAccountName")}
              error={errors?.name?.[0] && t(errors.name[0])}
            />
          </div>
        </div>
      </div>

      {/* Account balance */}
      <div>
        <label htmlFor="balance" className="mb-2 block text-sm font-medium">
          {t("currentBalance")}
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <Input
              id="balance"
              name="balance"
              className="mb-3"
              placeholder={t("enterBalance")}
              step="0.01"
              error={errors?.balance?.[0] && t(errors.balance[0])}
            />
          </div>
        </div>
      </div>

      {/* Default account */}
      <div className="flex items-center gap-3 mb-4">
        <label htmlFor="default" className="text-sm font-medium">
          {t("defaultAccount")}
        </label>
        <Checkbox id="default" name="default" />
      </div>

      {pending ? (
        <div className="flex w-full justify-center rounded-md bg-blue-600 py-2">
          <output
            className="h-5 w-5 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
            aria-live="polite"
          />
        </div>
      ) : (
        <button
          className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white disabled:opacity-60"
          type="submit"
        >
          {t("createAccount")}
        </button>
      )}
    </Card>
  );
};
