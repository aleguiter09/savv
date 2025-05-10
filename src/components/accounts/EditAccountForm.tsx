"use client";
import { Account } from "@/types/database";
import { FormAccountState } from "@/types/general";
import { updateAccountForm } from "@/utils/account-actions";
import { CurrencyDollarIcon } from "@heroicons/react/outline";
import { Card, NumberInput, TextInput } from "@tremor/react";
import { useTransition } from "react";
import { useFormState } from "react-dom";

export default function EditAccountForm({
  id,
  account,
}: Readonly<{
  id: string;
  account: Account;
}>) {
  const initialState = { message: null, errors: {} };
  const [pending, startTransition] = useTransition();
  const [state, dispatch] = useFormState(
    (prevState: FormAccountState, formData: FormData) =>
      updateAccountForm(prevState, formData, id),
    initialState
  );

  const submit = (formData: FormData) => {
    startTransition(() => {
      dispatch(formData);
    });
  };

  return (
    <form action={submit}>
      <Card className="rounded-md p-4 flex flex-col gap-4">
        {/* Account name */}
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Enter a name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <TextInput
                id="name"
                name="name"
                placeholder="Enter account name"
                defaultValue={account.name}
                error={!!state.errors?.name}
                errorMessage={state.errors?.name?.at(0)}
              />
            </div>
          </div>
        </div>

        {/* Account balance */}
        <div>
          <label htmlFor="balance" className="mb-2 block text-sm font-medium">
            Current balance
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <NumberInput
                id="balance"
                name="balance"
                icon={CurrencyDollarIcon}
                className="mb-3"
                placeholder="Enter amount..."
                enableStepper={false}
                step="0.01"
                defaultValue={account.balance}
                error={!!state.errors?.balance}
                errorMessage={state.errors?.balance?.at(0)}
              />
            </div>
          </div>
        </div>

        {/* Default account */}
        <div className="flex items-center gap-3">
          <label htmlFor="default" className="text-sm font-medium">
            Default account
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
            Edit account
          </button>
        )}
      </Card>
    </form>
  );
}
