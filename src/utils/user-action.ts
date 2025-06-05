"use server";
import {
  FormUserState,
  LoginFormUserState,
  ResetFormUserState,
  UpdatePasswordFormUserState,
} from "@/types/general";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAccount } from "@/services/accounts";
import { createSettings } from "@/services/settings";
import { getLocale, getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { createClient } from "./supabase/server";

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

const ResetUserSchema = LoginUserSchema.omit({ password: true });

const UpdatePasswordSchema = z
  .object({
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

export const createUserForm = async (
  prevState: FormUserState,
  formData: FormData
): Promise<FormUserState> => {
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
    return { ...prevState, errors: { confirmPassword: [errorAcc.message] } };
  }

  const locale = await getLocale();
  const { error: errorSettings } = await createSettings(locale as "es" | "en");

  if (errorSettings) {
    return {
      ...prevState,
      errors: { confirmPassword: [errorSettings.message] },
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
};

export const loginUserForm = async (
  prevState: LoginFormUserState,
  formData: FormData
): Promise<LoginFormUserState> => {
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
    if (error.code === "invalid_credentials") {
      return { ...prevState, errors: { password: ["invalidCredentials"] } };
    } else {
      return { ...prevState, errors: { password: ["defaultError"] } };
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
