"use client";

import { adaptCategories } from "../adapters/adaptCategories";
import type { Account, EffectiveCategory } from "../types/global.types";
import { createContext, useContext, useMemo } from "react";

type DataContextType = {
  accounts: Account[];
  incomeCategories: EffectiveCategory[];
  expenseCategories: EffectiveCategory[];
  parentCategories: EffectiveCategory[];
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
  categories: EffectiveCategory[];
  children: React.ReactNode;
}) => {
  const derived = useMemo(() => adaptCategories(categories), [categories]);
  const value = useMemo(() => ({ accounts, ...derived }), [accounts, derived]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
