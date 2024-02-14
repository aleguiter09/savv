"use client";
import { createAccountForm } from "@/utils/account-actions";
import { CurrencyDollarIcon } from "@heroicons/react/outline";
import { NumberInput, TextInput } from "@tremor/react";
import { useFormState } from "react-dom";

export default function CreateAccountForm() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createAccountForm, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4">
        {/* Account name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Enter a name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <TextInput
                id="name"
                name="name"
                placeholder="Enter account name"
                error={!!state.errors?.name}
                errorMessage={state.errors?.name?.at(0)}
              />
            </div>
          </div>
        </div>

        {/* Account balance */}
        <div className="mb-4">
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
                placeholder="Enter an amount..."
                enableStepper={false}
                step="0.01"
                error={!!state.errors?.balance}
                errorMessage={state.errors?.balance?.at(0)}
              />
            </div>
          </div>
        </div>
        <button
          className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-60"
          type="submit"
        >
          Create account
        </button>
      </div>
    </form>
  );
}
