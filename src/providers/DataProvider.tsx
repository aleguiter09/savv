"use client";

import { Account, Category } from "@/types/global.types";
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
    () => categories.filter((category) => category.parent_id === 60), // 60 is the id of the income category
    [categories]
  );

  const expenseCategories = useMemo(
    () =>
      categories.filter(
        (category) => category.parent_id !== null && category.parent_id !== 60
      ), // 61 is the id of the expense category
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
