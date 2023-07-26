"use client";
import { createContext, useContext, useEffect } from "react";
import { useSupabase } from "./supabaseContext";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const AuthContext = createContext({
  user: null,
  error: null,
  isLoading: true,
  mutate: null,
  signOut: async () => {},
});

export default function AuthProvider({ serverSession, children }) {
  const { supabase } = useSupabase();
  const router = useRouter();

  const getUser = async () => {
    const session = await supabase.auth.getSession();
    return session?.user ? session.user : null;
  };

  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR(serverSession ? "user-context" : null, getUser);

  const signInWithEmail = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return error.message;
    }
    return null;
  };

  const signUp = async (email, password) => {
    await supabase.auth.signUp({
      email: email,
      password: password,
    });

    router.push("/");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverSession?.access_token) {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase, serverSession?.access_token]);

  const value = {
    user,
    error,
    isLoading,
    mutate,
    signOut,
    signInWithEmail,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  let context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth not inside a AuthProvider");
  }
  return context;
};
