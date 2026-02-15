"use server";

import type { ServerActionResponse } from "@/modules/shared/types/general";
import type { Account } from "@/modules/shared/types/global.types";
import { AccountSchema } from "@/modules/shared/utils/schemas";
import { setToastMessage } from "@/modules/shared/actions/toast";
import {
  createAccount,
  deleteAccount,
  updateAccount,
} from "@/modules/accounts/services/accounts";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createAccountForm(
  data: z.infer<typeof AccountSchema>,
): Promise<ServerActionResponse> {
  const parsed = AccountSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Missing fields. Failed to create an account.",
    };
  }

  try {
    await createAccount(parsed.data);
  } catch (error) {
    return {
      success: false,
      error: "Database error: failed to create account: " + error,
    };
  }

  const t = await getTranslations("accounts");

  setToastMessage("success", t("createdSuccess"));
  revalidatePath("/settings/accounts");
  redirect("/settings/accounts");
}

export async function updateAccountForm(
  account: Account,
  data: z.infer<typeof AccountSchema>,
): Promise<ServerActionResponse> {
  const parsed = AccountSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Missing fields. Failed to update the account.",
    };
  }

  try {
    await updateAccount(parsed.data, account.id!);
  } catch (error) {
    return {
      success: false,
      error: "Database error: failed to update account: " + error,
    };
  }

  const t = await getTranslations("accounts");

  setToastMessage("success", t("updatedSuccess"));
  revalidatePath("/settings/accounts");
  redirect("/settings/accounts");
}

export const deleteAccountForm = async (account: Account) => {
  if (!account.id) return;
  await deleteAccount(account.id);

  const t = await getTranslations("accounts");

  setToastMessage("success", t("deletedSuccess"));
  revalidatePath("/settings/accounts");
  redirect("/settings/accounts");
};
