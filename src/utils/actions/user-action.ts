"use server";
import {
  ResetFormUserState,
  ServerActionResponse,
  UpdatePasswordFormUserState,
} from "@/types/general";
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
    default: true,
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
  prevState: ResetFormUserState,
  formData: FormData
): Promise<ResetFormUserState> => {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedData = ResetUserSchema.safeParse(rawFormData);

  if (!validatedData.success) {
    return { errors: validatedData.error.flatten().fieldErrors, message: null };
  }

  const { email } = validatedData.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { ...prevState, errors: { email: [error.message] } };
  }

  return { message: "resetSent", errors: {} };
};

export const updatePasswordForm = async (
  prevState: UpdatePasswordFormUserState,
  formData: FormData
): Promise<UpdatePasswordFormUserState> => {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedData = UpdatePasswordSchema.safeParse(rawFormData);

  if (!validatedData.success) {
    return { errors: validatedData.error.flatten().fieldErrors, message: null };
  }

  const { password } = validatedData.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    if (error.code === "same_password") {
      return { ...prevState, errors: { confirmPassword: ["samePassword"] } };
    } else {
      return { ...prevState, errors: { confirmPassword: ["defaultError"] } };
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
};
