import { supabase } from "./supabase/client";

export const getAccounts = async (userId) => {
  const response = await supabase.from("account").select().eq("user", userId);
  return response.data ? response.data : [];
};

export const insertAccount = async (acc) => {
  return await supabase.from("account").insert(acc);
};

export const deleteAccount = async (accId) => {
  const { data: expenses } = await supabase
    .from("expense")
    .select()
    .eq("account", accId);

  const { data: incomes } = await supabase
    .from("income")
    .select()
    .eq("account", accId);

  const promises = [];

  if (expenses) {
    expenses.forEach((exp) => {
      promises.push(
        supabase.from("expense").update({ account: null }).eq("id", exp.id)
      );
    });
  }

  if (incomes) {
    incomes.forEach((inc) => {
      promises.push(
        supabase.from("income").update({ account: null }).eq("id", inc.id)
      );
    });
  }

  await Promise.all(promises);

  return await supabase.from("account").delete().eq("id", accId);
};

export const updateAccount = async (accId, acc) => {
  return await supabase.from("account").update(acc).eq("id", accId);
};

export const getCategories = async (userId) => {
  const response = await supabase.from("category").select().eq("user", userId);
  return response.data ? response.data : [];
};

export const insertCategory = async (cat) => {
  return await supabase.from("category").insert(cat);
};

export const deleteCategory = async (catId) => {
  const { data: expenses } = await supabase
    .from("expense")
    .select()
    .eq("category", catId);

  const promises = [];

  if (expenses) {
    expenses.forEach((exp) => {
      promises.push(
        supabase.from("expense").update({ category: null }).eq("id", exp.id)
      );
    });
  }

  await Promise.all(promises);

  return await supabase.from("category").delete().eq("id", catId);
};

export const updateCategory = async (catId, cat) => {
  return await supabase.from("category").update(cat).eq("id", catId);
};

export const getExpenses = async (userId) => {
  const response = await supabase.from("expense").select().eq("user", userId);
  return response.data ? response.data : [];
};

export const insertExpense = async (exp) => {
  return await supabase.from("expense").insert(exp);
};

export const deleteExpense = async (expId) => {
  return await supabase.from("expense").delete().eq("id", expId);
};

export const updateExpense = async (expId, exp) => {
  return await supabase.from("expense").update(exp).eq("id", expId);
};

export const getIncomes = async (userId) => {
  const response = await supabase.from("income").select().eq("user", userId);
  return response.data ? response.data : [];
};

export const insertIncome = async (inc) => {
  return await supabase.from("income").insert(inc);
};

export const deleteIncome = async (incId) => {
  return await supabase.from("income").delete().eq("id", incId);
};

export const updateIncome = async (incId, inc) => {
  return await supabase.from("income").update(inc).eq("id", incId);
};
