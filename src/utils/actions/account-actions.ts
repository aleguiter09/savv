"use server";

import { setToastMessage } from "@/lib/toast";
import {
  createAccount,
  deleteAccount,
  updateAccount,
} from "@/services/accounts";
import { Account } from "@/types/database";
import { FormAccountState } from "@/types/general";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const AccountSchema = z.object({
  id: z.string(),
  name: z
    .string({
      required_error: "nameError",
    })
    .min(1, {
      message: "nameError",
    }),
  balance: z.coerce.number({
    invalid_type_error: "balanceError",
  }),
  default: z.enum(["true", "false"]).transform((value) => value === "true"),
});

const CreateAccountSchema = AccountSchema.omit({ id: true });

export async function createAccountForm(
  prevState: FormAccountState,
  formData: FormData
): Promise<FormAccountState> {
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

  const t = await getTranslations("accounts");

  setToastMessage("success", t("createdSuccess"));
  revalidatePath("/settings/accounts");
  redirect("/settings/accounts");
}

const UpdateAccountSchema = AccountSchema.omit({ id: true });

export async function updateAccountForm(
  prevState: FormAccountState,
  formData: FormData,
  id: string
): Promise<FormAccountState> {
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

  const t = await getTranslations("accounts");

  setToastMessage("success", t("updatedSuccess"));
  revalidatePath("/settings/accounts");
  redirect("/settings/accounts");
}

export const deleteAccountForm = async (account: Account) => {
  await deleteAccount(account.id?.toString() ?? "");

  const t = await getTranslations("accounts");

  setToastMessage("success", t("deletedSuccess"));
  revalidatePath("/settings/accounts");
  redirect("/settings/accounts");
};
