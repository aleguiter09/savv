import {
  getAccounts,
  getExpenses,
  getIncomes,
  getCategories,
} from "../api/database";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const FinanceContext = createContext({
  accounts: [],
  categories: [],
  expenses: [],
  incomes: [],
  updateAccounts: () => {},
  updateCategories: () => {},
});

export function FinancesProvider({ children }) {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const setData = async () => {
      const accs = await getAccounts(user.id);
      accs.sort((a, b) => b.amount - a.amount);

      const cats = await getCategories(user.id);
      cats.sort((a, b) => b.amount - a.amount);

      const exps = await getExpenses(user.id);
      const incs = await getIncomes(user.id);

      setAccounts(accs);
      setCategories(cats);
      setExpenses(exps);
      setIncomes(incs);

      let sum = 0;
      cats.forEach((c) => (sum += c.amount));
      setTotalExpenses(sum);

      sum = 0;
      accs.forEach((acc) => (sum += acc.amount));
      setTotal(sum);
    };

    setData();
  }, []);

  const updateAccounts = async () => {
    const accs = await getAccounts(user.id);
    accs.sort((a, b) => b.amount - a.amount);

    let sum = 0;
    accs.forEach((acc) => (sum += acc.amount));
    setTotal(sum);

    setAccounts(accs);
  };

  const updateCategories = async () => {
    const cats = await getCategories(user.id);
    cats.sort((a, b) => b.amount - a.amount);

    let sum = 0;
    cats.forEach((c) => (sum += c.amount));
    setTotalExpenses(sum);

    setCategories(cats);
  };

  const value = {
    accounts,
    categories,
    expenses,
    incomes,
    total,
    totalExpenses,
    updateAccounts,
    updateCategories,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

export function useFinancesContext() {
  return useContext(FinanceContext);
}
