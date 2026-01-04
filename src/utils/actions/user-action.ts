"use server";
import type { ServerActionResponse } from "@/types/general";
import { z } from "zod";
import { redirect } from "next/navigation";
import { createAccount } from "@/services/accounts";
import { createSettings } from "@/services/settings";
import { getLocale, getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";
import {
  LoginUserSchema,
  ResetUserSchema,
  UpdatePasswordSchema,
  UserSchema,
} from "@/lib/schemas";

export const createUserForm = async (
  data: z.infer<typeof UserSchema>
): Promise<ServerActionResponse> => {
  const parsed = UserSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Missing fields. Failed to create user",
    };
  }

  const { email, password } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { success: false, error: error.message };
  }

  const t = await getTranslations("auth");

  const { error: errorAcc } = await createAccount({
    name: t("defaultAccountName"),
    balance: 0,
    is_default: true,
  });

  if (errorAcc) {
    return { success: false, error: errorAcc.message };
  }

  const locale = await getLocale();
  const { error: errorSettings } = await createSettings(locale as "es" | "en");

  if (errorSettings) {
    return { success: false, error: errorSettings.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
};

export const loginUserForm = async (
  data: z.infer<typeof LoginUserSchema>
): Promise<ServerActionResponse> => {
  const parsed = LoginUserSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Missing fields. Failed to login",
    };
  }

  const { email, password } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "invalid_credentials") {
      return { success: false, error: "invalidCredentials" };
    } else {
      return { success: false, error: "defaultError" };
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
};

export const logout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/login");
};

export const resetPasswordForm = async (
  data: z.infer<typeof ResetUserSchema>
): Promise<ServerActionResponse> => {
  const parsed = ResetUserSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "defaultError" };
  }

  const { email } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

export const updatePasswordForm = async (
  data: z.infer<typeof UpdatePasswordSchema>
): Promise<ServerActionResponse> => {
  const parsed = UpdatePasswordSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "passwordError" };
  }

  const { password } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    if (error.code === "same_password") {
      return { success: false, error: "samePassword" };
    } else {
      return { success: false, error: "defaultError" };
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
};
