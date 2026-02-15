"use client";

import { adaptCategories } from "../adapters/adaptCategories";
import type { Account, Category } from "../types/global.types";
import { createContext, useContext, useMemo } from "react";

type DataContextType = {
  accounts: Account[];
  incomeCategories: Category[];
  expenseCategories: Category[];
  parentCategories: Category[];
};

const DataContext = createContext<DataContextType>({
  accounts: [],
  incomeCategories: [],
  expenseCategories: [],
  parentCategories: [],
});

export const DataProvider = ({
  accounts,
  categories,
  children,
}: {
  accounts: Account[];
  categories: Category[];
  children: React.ReactNode;
}) => {
  const derived = useMemo(() => adaptCategories(categories), [categories]);
  const value = useMemo(() => ({ accounts, ...derived }), [accounts, derived]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
