"use client";
import { Account } from "@/types/database";
import { FormAccountState } from "@/types/general";
import { updateAccountForm } from "@/utils/actions/account-actions";
import { CurrencyDollarIcon } from "@heroicons/react/outline";
import { Card, NumberInput, TextInput } from "@tremor/react";
import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";

export default function EditAccountForm({
  id,
  account,
}: Readonly<{
  id: string;
  account: Account;
}>) {
  const [state, dispatch] = useFormState(
    (prevState: FormAccountState, formData: FormData) =>
      updateAccountForm(prevState, formData, id),
    { message: null, errors: {} }
  );

  return (
    <form action={dispatch}>
      <Form state={state} account={account} />
    </form>
  );
}

const Form = ({
  state,
  account,
}: {
  state: FormAccountState;
  account: Account;
}) => {
  const t = useTranslations("accounts");
  const { errors } = state;
  const { pending } = useFormStatus();

  return (
    <Card className="rounded-md p-4 flex flex-col gap-4">
      {/* Account name */}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          {t("enterName")}
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <TextInput
              id="name"
              name="name"
              placeholder={t("enterAccountName")}
              defaultValue={account.name}
              error={!!errors?.name}
              errorMessage={
                errors?.name ? t(errors?.name?.at(0) as string) : undefined
              }
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
            <NumberInput
              id="balance"
              name="balance"
              icon={CurrencyDollarIcon}
              className="mb-3"
              placeholder={t("enterBalance")}
              enableStepper={false}
              step="0.01"
              defaultValue={account.balance}
              error={!!errors?.balance}
              errorMessage={
                errors?.balance
                  ? t(errors?.balance?.at(0) as string)
                  : undefined
              }
            />
          </div>
        </div>
      </div>

      {/* Default account */}
      <div className="flex items-center gap-3">
        <label htmlFor="default" className="text-sm font-medium">
          {t("defaultAccount")}
        </label>
        <input
          type="checkbox"
          id="default"
          name="default"
          defaultChecked={account.default}
        />
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
          className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white focus:outline-none focus:ring focus:ring-gray-blue"
          type="submit"
        >
          {t("editAccount")}
        </button>
      )}
    </Card>
  );
};
