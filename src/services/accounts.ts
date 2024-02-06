import { Account } from "@/types/database";
import { SupabaseClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";

export const getAccounts = async (supabase: SupabaseClient) => {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  noStore();
  try {
    const { data } = await supabase.from("account").select("id, name, balance");

    if (data) return data;
    return [];
  } catch (error) {
    console.log("Database error", error);
    return [];
  }
};

export const getAccountBalanceById = async (
  supabase: SupabaseClient,
  id: number
) => {
  if (id !== 0) {
    const { data } = await supabase
      .from("account")
      .select("balance")
      .eq("id", id)
      .single();

    return data?.balance || 0;
  } else {
    const { data } = await supabase.from("account").select("balance");

    return data?.reduce((a, b) => a + b.balance, 0) ?? 0;
  }
};

export const getAccountById = async (supabase: SupabaseClient, id: number) => {
  const { data } = await supabase
    .from("account")
    .select("id, name, balance")
    .eq("id", id)
    .single();

  return data;
};

export const getDefaultAccountId = async (supabase: SupabaseClient) => {
  const { data } = await supabase
    .from("account")
    .select("id")
    .eq("default", true)
    .single();

  return data?.id ?? 0;
};

export const createAccount = async (
  supabase: SupabaseClient,
  account: Account
) => {
  return await supabase.from("account").insert(account);
};

export const deleteAccount = async (
  supabase: SupabaseClient,
  accountId: string
) => {
  return await supabase.from("account").delete().eq("id", accountId);
};

export const updateAccount = async (
  supabase: SupabaseClient,
  account: Account,
  accountId: string
) => {
  return await supabase.from("account").update(account).eq("id", accountId);
};

export const updateAccountBalance = async (
  supabase: SupabaseClient,
  accountId: number,
  amount: number,
  positive: boolean
) => {
  const currentBalance = await getAccountBalanceById(supabase, accountId);

  if (positive) {
    const { error } = await supabase
      .from("account")
      .update({ balance: currentBalance + amount })
      .eq("id", accountId);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("account")
      .update({ balance: currentBalance - amount })
      .eq("id", accountId);

    if (error) throw error;
  }
};
