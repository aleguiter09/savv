"use server";

import { createAccount, updateAccount } from "@/services/accounts";
import { FormAccountState } from "@/types/general";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const AccountSchema = z.object({
  id: z.string(),
  name: z
    .string({
      required_error: "Please choose a name for the account",
    })
    .min(1, {
      message: "Please choose a name for the account",
    }),
  balance: z.coerce.number({
    invalid_type_error: "The balance amount should be a number.",
  }),
  default: z.enum(["true", "false"]).transform((value) => value === "true"),
});

const CreateAccountSchema = AccountSchema.omit({ id: true });

export async function createAccountForm(
  prevState: FormAccountState,
  formData: FormData
) {
  formData.get("default") === "on"
    ? formData.set("default", "true")
    : formData.set("default", "false");
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedData = CreateAccountSchema.safeParse(rawFormData);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create an account.",
    };
  }

  try {
    await createAccount(validatedData.data);
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }

  revalidatePath("/settings/accounts");
  redirect("/settings/accounts");
}

const UpdateAccountSchema = AccountSchema.omit({ id: true });

export async function updateAccountForm(
  prevState: FormAccountState,
  formData: FormData,
  id: string
) {
  formData.get("default") === "on"
    ? formData.set("default", "true")
    : formData.set("default", "false");
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedData = UpdateAccountSchema.safeParse(rawFormData);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Missing fields. Failed to update the account.",
    };
  }

  try {
    await updateAccount(validatedData.data, id);
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }

  revalidatePath("/settings/accounts");
  redirect("/settings/accounts");
}
