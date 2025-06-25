"use client";
import { Account } from "@/types/database";
import { FormAccountState } from "@/types/general";
import { updateAccountForm } from "@/utils/actions/account-actions";
import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

export function EditAccountForm({
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
    <Card className="rounded-md p-4 flex flex-col gap-2">
      {/* Account name */}
      <Input
        id="name"
        name="name"
        placeholder={t("enterAccountName")}
        defaultValue={account.name}
        label={t("enterName")}
        error={errors?.name?.[0] && t(errors.name[0])}
      />

      {/* Account balance */}
      <Input
        id="balance"
        name="balance"
        placeholder={t("enterBalance")}
        step="0.01"
        defaultValue={account.balance}
        label={t("currentBalance")}
        error={errors?.balance?.[0] && t(errors.balance[0])}
      />

      {/* Default account */}
      <div className="flex items-center gap-3 my-2">
        <label htmlFor="default" className="text-sm font-medium">
          {t("defaultAccount")}
        </label>
        <Checkbox
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
          className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white focus:outline-none focus:ring focus:ring-gray-blue"
          type="submit"
        >
          {t("editAccount")}
        </button>
      )}
    </Card>
  );
};
