"use client";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "../utils/supabase-browser";
import { createContext, useContext, useMemo } from "react";

interface ContextValue {
  supabase: SupabaseClient | undefined;
}

const Context = createContext<ContextValue>({ supabase: undefined });

export default function SupabaseProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = useMemo(() => createClient(), []);

  const contextValue = useMemo(() => ({ supabase }), [supabase]);
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase not inside a SupabaseProvider");
  }
  return context;
};
