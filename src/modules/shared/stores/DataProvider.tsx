"use client";

import { CategoryView } from "@/modules/categories/types/types";
import { adaptCategories } from "../adapters/adaptCategories";
import { createContext, useContext, useMemo } from "react";
import { AccountView } from "@/modules/accounts/types/types";

type DataContextType = {
  accounts: AccountView[];
  incomeCategories: CategoryView[];
  expenseCategories: CategoryView[];
  parentCategories: CategoryView[];
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
  accounts: AccountView[];
  categories: CategoryView[];
  children: React.ReactNode;
}) => {
  const derived = useMemo(() => adaptCategories(categories), [categories]);
  const value = useMemo(() => ({ accounts, ...derived }), [accounts, derived]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
