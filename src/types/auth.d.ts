import { User } from "@supabase/supabase-js";
import { KeyedMutator } from "swr";

export type AuthContextType = {
  user: User | null | undefined;
  error: Error | null;
  isLoading: boolean;
  mutate: KeyedMutator<User | null> | null;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
};
