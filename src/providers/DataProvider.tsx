"use client";

import { Account, Category } from "@/types/database";
import { createContext, useContext, useMemo } from "react";

type DataContextType = {
  accounts: Account[];
  incomeCategories: Category[];
  expenseCategories: Category[];
};

const initialData: DataContextType = {
  accounts: [],
  incomeCategories: [],
  expenseCategories: [],
};

const DataContext = createContext<DataContextType>(initialData);

export const DataProvider = ({
  accounts,
  categories,
  children,
}: {
  accounts: Account[];
  categories: Category[];
  children: React.ReactNode;
}) => {
  const incomeCategories = useMemo(
    () => categories.filter((category) => category.for === "income"),
    [categories]
  );

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.for === "expense"),
    [categories]
  );

  const contextValue = useMemo(
    () => ({
      accounts,
      incomeCategories,
      expenseCategories,
    }),
    [accounts, incomeCategories, expenseCategories]
  );

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
