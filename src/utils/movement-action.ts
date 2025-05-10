"use server";
import { FormMovementState } from "@/types/general";
import { z } from "zod";
import { createClient } from "./supabase-server";
import { revalidatePath } from "next/cache";
import { deleteMovement, insertMovement } from "@/services/movements";
import { redirect } from "next/navigation";
import { updateAccountBalance } from "@/services/accounts";
import { Movement } from "@/types/database";

const IncomeExpenseSchema = z.object({
  amount: z.coerce
    .number({
      invalid_type_error: "The amount should be a number",
    })
    .positive({ message: "Please enter an amount greater that $0" }),
  comment: z
    .string({
      required_error: "Please enter a comment",
    })
    .min(1, {
      message: "Please enter a comment",
    }),
  type: z.enum(["expense", "income"]),
  category: z.coerce
    .number({
      required_error: "Please choose a category",
      invalid_type_error: "Please choose a category",
    })
    .positive({ message: "Please choose a category" }),
  from: z.coerce
    .number({
      required_error: "Please choose an account",
      invalid_type_error: "Please choose an account",
    })
    .positive({ message: "Please choose an account" }),
  done_at: z
    .string({
      required_error: "Please choose a date",
    })
    .min(1, {
      message: "Please choose a date",
    }),
});

const TransferSchema = z.object({
  amount: z.coerce
    .number({
      invalid_type_error: "The amount should be a number",
    })
    .positive({ message: "Please enter an amount greater that $0" }),
  comment: z
    .string({
      required_error: "Please enter a comment",
    })
    .min(1, {
      message: "Please enter a comment",
    }),
  type: z.enum(["transfer"]),
  from: z.coerce
    .number({
      required_error: "Please choose an account",
      invalid_type_error: "Please choose an account",
    })
    .positive({ message: "Please choose an account" }),
  where: z.coerce
    .number({
      required_error: "Please choose an account",
      invalid_type_error: "Please choose an account",
    })
    .positive({ message: "Please choose an account" }),
  done_at: z
    .string({
      required_error: "Please choose a date",
    })
    .min(1, {
      message: "Please choose a date",
    }),
});

export const addMovementForm = async (
  prevState: FormMovementState,
  formData: FormData
) => {
  const rawFormData = Object.fromEntries(formData.entries());

  let validatedData;
  if (rawFormData.type === "transfer") {
    validatedData = TransferSchema.safeParse(rawFormData);
  } else {
    validatedData = IncomeExpenseSchema.safeParse(rawFormData);
  }

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create the movement",
    };
  }

  try {
    const supabase = await createClient();
    await insertMovement(supabase, validatedData.data);
    if (validatedData.data.type === "transfer") {
      await Promise.all([
        updateAccountBalance(
          supabase,
          validatedData.data.from,
          validatedData.data.amount,
          false
        ),
        updateAccountBalance(
          supabase,
          validatedData.data.where,
          validatedData.data.amount,
          true
        ),
      ]);
    } else if (validatedData.data.type === "expense") {
      await updateAccountBalance(
        supabase,
        validatedData.data.from,
        validatedData.data.amount,
        false
      );
    } else if (validatedData.data.type === "income") {
      await updateAccountBalance(
        supabase,
        validatedData.data.from,
        validatedData.data.amount,
        true
      );
    }
  } catch (error) {
    return {
      message: "Database error: failed to create movement",
    };
  }

  revalidatePath("/");
  redirect("/");
};

export const deleteMovementForm = async (movement: Movement) => {
  const supabase = await createClient();
  await deleteMovement(supabase, movement.id?.toString() ?? "");
  if (movement.type === "transfer") {
    await Promise.all([
      updateAccountBalance(supabase, movement.from, movement.amount, true),
      updateAccountBalance(
        supabase,
        movement.where as number,
        movement.amount,
        false
      ),
    ]);
  } else if (movement.type === "expense") {
    await updateAccountBalance(supabase, movement.from, movement.amount, true);
  } else if (movement.type === "income") {
    await updateAccountBalance(supabase, movement.from, movement.amount, false);
  }

  revalidatePath("/");
  redirect("/");
};

export const updateMovementForm = async (
  prevState: FormMovementState,
  formData: FormData
) => {
  const rawFormData = Object.fromEntries(formData.entries());

  const previousMovement = {
    id: rawFormData.id as string,
    amount: parseFloat(rawFormData.previousAmount as string),
    from: parseInt(rawFormData.previousFrom as string),
    where: parseInt(rawFormData.previousWhere as string),
    type: rawFormData.previousType,
  };

  delete rawFormData.id;
  delete rawFormData.previousAmount;
  delete rawFormData.previousFrom;
  delete rawFormData.previousWhere;
  delete rawFormData.previousType;

  let validatedData;
  if (rawFormData.type === "transfer") {
    validatedData = TransferSchema.safeParse(rawFormData);
  } else {
    validatedData = IncomeExpenseSchema.safeParse(rawFormData);
  }

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create the movement",
    };
  }

  try {
    const supabase = await createClient();

    // Insertion of new Movement
    await insertMovement(supabase, validatedData.data);
    if (validatedData.data.type === "transfer") {
      await Promise.all([
        updateAccountBalance(
          supabase,
          validatedData.data.from,
          validatedData.data.amount,
          false
        ),
        updateAccountBalance(
          supabase,
          validatedData.data.where,
          validatedData.data.amount,
          true
        ),
      ]);
    } else if (validatedData.data.type === "expense") {
      await updateAccountBalance(
        supabase,
        validatedData.data.from,
        validatedData.data.amount,
        false
      );
    } else if (validatedData.data.type === "income") {
      await updateAccountBalance(
        supabase,
        validatedData.data.from,
        validatedData.data.amount,
        true
      );
    }

    // Deletion of previous Movement
    await deleteMovement(supabase, previousMovement.id);
    if (previousMovement.type === "transfer") {
      await Promise.all([
        updateAccountBalance(
          supabase,
          previousMovement.from,
          previousMovement.amount,
          true
        ),
        updateAccountBalance(
          supabase,
          previousMovement.where,
          previousMovement.amount,
          false
        ),
      ]);
    } else if (previousMovement.type === "expense") {
      await updateAccountBalance(
        supabase,
        previousMovement.from,
        previousMovement.amount,
        true
      );
    } else if (previousMovement.type === "income") {
      await updateAccountBalance(
        supabase,
        previousMovement.from,
        previousMovement.amount,
        false
      );
    }
  } catch (error) {
    return {
      message: "Database error: failed to update movement",
    };
  }

  revalidatePath("/");
  redirect("/");
};
