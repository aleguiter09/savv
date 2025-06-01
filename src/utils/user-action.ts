"use server";
import {
  FormUserState,
  LoginFormUserState,
  ResetFormUserState,
} from "@/types/general";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAccount } from "@/services/accounts";
import { createClient } from "./supabase-server";
import { createSettings } from "@/services/settings";
import { getLocale, getTranslations } from "next-intl/server";

const UserSchema = z
  .object({
    email: z.string().email({ message: "emailError" }),
    password: z.string().min(8, { message: "passwordError" }),
    confirmPassword: z.string().min(8, { message: "passwordError" }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "confirmPasswordError",
        path: ["confirmPassword"],
      });
    }
  });

const LoginUserSchema = z.object({
  email: z.string().email({ message: "emailError" }),
  password: z.string().min(8, { message: "passwordError" }),
});

const ResetUserSchema = LoginUserSchema.omit({
  password: true,
});

export const createUserForm = async (
  prevState: FormUserState,
  formData: FormData
) => {
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedData = UserSchema.safeParse(rawFormData);
  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create the user",
    };
  }

  const { email, password } = validatedData.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { ...prevState, errors: { email: [error.message] } };
  }

  const t = await getTranslations("auth");

  const { error: errorAcc } = await createAccount({
    name: t("defaultAccountName"),
    balance: 0,
    default: true,
  });

  if (errorAcc) {
    return { ...prevState, errors: { account: [errorAcc.message] } };
  }

  const locale = await getLocale();
  const { error: errorSettings } = await createSettings(locale as "es" | "en");

  if (errorSettings) {
    return { ...prevState, errors: { settings: [errorSettings.message] } };
  }

  redirect("/");
};

export const loginUserForm = async (
  prevState: LoginFormUserState,
  formData: FormData
) => {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedData = LoginUserSchema.safeParse(rawFormData);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Missing fields. Failed to login",
    };
  }

  const { email, password } = validatedData.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ...prevState, errors: { email: [error.message] } };
  }

  redirect("/");
};

export const resetPasswordForm = async (
  prevState: ResetFormUserState,
  formData: FormData
) => {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedData = ResetUserSchema.safeParse(rawFormData);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: null,
    };
  }

  const { email } = validatedData.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { ...prevState, errors: { email: [error.message] } };
  }

  return { message: "resetSent", errors: {} };
};

export const logout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
};
