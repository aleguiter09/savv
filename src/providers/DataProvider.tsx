"use client";

import { Account } from "@/types/database";
import { createContext, useContext } from "react";

const DataContext = createContext<Account[]>([]);

export const DataProvider = ({
  accounts,
  children,
}: {
  accounts: Account[];
  children: React.ReactNode;
}) => {
  return (
    <DataContext.Provider value={accounts}>{children}</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
