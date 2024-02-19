"use server";
import { FormUserState, LoginFormUserState } from "@/types/general";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "./supabase-server";

const UserSchema = z.object({
    email: z.string().email({ message: "Provide a valid email" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirmPassword"],
        });
    }
});

const LoginUserSchema = z.object({
    email: z.string().email({ message: "Provide a valid email" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export const createUserForm = async (prevState: FormUserState, formData: FormData) => {
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

    redirect("/")
};

export const loginUserForm = async (prevState: LoginFormUserState, formData: FormData) => {
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
}

export const logout = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}