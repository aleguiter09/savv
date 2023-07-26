import { supabase } from "./supabase/client";

export const register = async (email, password) => {
  return await supabase.auth.signUp({
    email: email,
    password: password,
  });
};

export const login = async (email, password) => {
  return await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
};
