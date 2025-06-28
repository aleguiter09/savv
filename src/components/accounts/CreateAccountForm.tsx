"use client";
import { createAccountForm } from "@/utils/actions/account-actions";
import { useFormState } from "react-dom";
import { AccountForm } from "./AccountForm";

export function CreateAccountForm() {
  const [state, dispatch] = useFormState(createAccountForm, {
    message: null,
    errors: {},
  });

  return (
    <form action={dispatch}>
      <AccountForm state={state} />
    </form>
  );
}
