"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useSupabase } from "./supabaseContext";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({
  serverSession,
  children,
}: Readonly<{ serverSession: Session | null; children: React.ReactNode }>) {
  const { supabase } = useSupabase();
  const router = useRouter();

  const getUser = async () => {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data?.session?.user ? data?.session.user : null;
  };

  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR(serverSession ? "user-context" : null, getUser);

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      if (!supabase) return null;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return error.message;
      }

      router.push("/");
      return null;
    },
    [supabase, router],
  );

  const signUp = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      if (!supabase) return null;
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        return error.message;
      }

      router.push("/");
      return null;
    },
    [supabase, router],
  );

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    router.push("/login");
  }, [supabase, router]);

  useEffect(() => {
    const {
      data: { subscription },
    } = (supabase as SupabaseClient).auth.onAuthStateChange(
      (event, session) => {
        if (session?.access_token !== serverSession?.access_token) {
          router.refresh();
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase, serverSession?.access_token]);

  const value = useMemo(
    () => ({
      user,
      error,
      isLoading,
      mutate,
      signOut,
      signInWithEmail,
      signUp,
    }),
    [user, error, isLoading, mutate, signOut, signInWithEmail, signUp],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth not inside a AuthProvider");
  }
  return context;
};
