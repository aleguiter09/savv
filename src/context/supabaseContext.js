"use client";
import { createClient } from "../utils/supabase-browser";
import { createContext, useContext, useState } from "react";

const Context = createContext();

export default function SupabaseProvider({ children }) {
  const [supabase] = useState(() => createClient());

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>;
}

export const useSupabase = () => {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase not inside a SupabaseProvider");
  }
  return context;
};
