import { Account } from "@/types/global.types";
import { AccountIds } from "@/types/general";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getAccounts = cache(async (): Promise<Account[]> => {
  const supabase = await createClient();

  try {
    const { data } = await supabase
      .from("account")
      .select("id, name, balance, is_default")
      .order("balance", { ascending: false });

    return data || [];
  } catch (error) {
    console.error("Database error", error);
    return [];
  }
});

export const getAccountBalanceById = async (
  id: AccountIds
): Promise<number> => {
  const supabase = await createClient();
  let query = supabase.from("account").select("balance");

  if (id !== "all") {
    query = query.eq("id", id);
  }

  const { data } = await query;
  return data?.reduce((a, b) => a + b.balance, 0) ?? 0;
};

export const getAccountById = async (id: number): Promise<Account | null> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from("account")
    .select("id, name, balance, is_default")
    .eq("id", id)
    .single();

  return data;
};

export const getDefaultAccountId = async (): Promise<number> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from("account")
    .select("id")
    .eq("is_default", true)
    .single();

  return data?.id ?? 0;
};

export const createAccount = async (account: Account) => {
  const supabase = await createClient();
  return await supabase.from("account").insert(account);
};

export const deleteAccount = async (accountId: number) => {
  const supabase = await createClient();
  return await supabase.from("account").delete().eq("id", accountId);
};

export const updateAccount = async (account: Account, accountId: number) => {
  const supabase = await createClient();
  return await supabase.from("account").update(account).eq("id", accountId);
};

export const updateAccountBalances = async (
  updates: Array<{ account_id: number; amount_change: number }>
) => {
  const supabase = await createClient();

  const { error } = await supabase.rpc("update_multiple_account_balances", {
    updates: updates,
  });

  if (error) {
    console.error("Error updating account balances:", error);
    throw new Error("Failed to update account balances");
  }
};
