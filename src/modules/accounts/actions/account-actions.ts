"use server";
import type { ServerActionResponse } from "@/modules/shared/types/global.types";
import { AccountSchema } from "@/modules/shared/utils/schemas";
import {
  createAccount,
  deleteAccount,
  updateAccount,
} from "@/modules/accounts/services/accounts";
import { revalidatePath } from "next/cache";
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

  revalidatePath("/settings/accounts");
  return { success: true };
}

export async function updateAccountForm(
  accountId: number,
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
    await updateAccount(parsed.data, accountId);
  } catch (error) {
    return {
      success: false,
      error: "Database error: failed to update account: " + error,
    };
  }

  revalidatePath("/settings/accounts");
  return { success: true };
}

export const deleteAccountForm = async (
  accountId: number,
): Promise<ServerActionResponse> => {
  try {
    await deleteAccount(accountId);
  } catch (error) {
    return {
      success: false,
      error: "Database error: failed to delete account: " + error,
    };
  }

  revalidatePath("/settings/accounts");
  return { success: true };
};
