import { Account } from "@/types/database";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getAccounts = cache(async (): Promise<Account[]> => {
  const supabase = await createClient();

  try {
    const { data } = await supabase
      .from("account")
      .select("id, name, balance, default")
      .order("balance", { ascending: false });

    return data || [];
  } catch (error) {
    console.error("Database error", error);
    return [];
  }
});

export const getAccountBalanceById = async (id: number): Promise<number> => {
  const supabase = await createClient();
  let query = supabase.from("account").select("balance");
  if (id !== 0) {
    query = query.eq("id", id);
  }
  const { data } = await query;
  return data?.reduce((a, b) => a + b.balance, 0) ?? 0;
};

export const getAccountById = async (id: number): Promise<Account | null> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from("account")
    .select("id, name, balance, default")
    .eq("id", id)
    .single();

  return data;
};

export const getDefaultAccountId = async (): Promise<number> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from("account")
    .select("id")
    .eq("default", true)
    .single();

  return data?.id ?? 0;
};

export const createAccount = async (account: Account) => {
  const supabase = await createClient();
  return await supabase.from("account").insert(account);
};

export const deleteAccount = async (accountId: string) => {
  const supabase = await createClient();
  return await supabase.from("account").delete().eq("id", accountId);
};

export const updateAccount = async (account: Account, accountId: string) => {
  const supabase = await createClient();
  return await supabase.from("account").update(account).eq("id", accountId);
};

export const updateAccountBalance = async (
  accountId: number,
  amount: number,
  positive: boolean
) => {
  const supabase = await createClient();
  const currentBalance = await getAccountBalanceById(accountId);

  if (currentBalance === undefined) {
    return Promise.reject(new Error(`Account with ID ${accountId} not found.`));
  }

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
