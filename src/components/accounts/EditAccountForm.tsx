"use client";
import { Account } from "@/types/global.types";
import { FormAccountState } from "@/types/general";
import { updateAccountForm } from "@/utils/actions/account-actions";
import { useFormState } from "react-dom";
import { AccountForm } from "./AccountForm";

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
      <AccountForm state={state} account={account} />
    </form>
  );
}
