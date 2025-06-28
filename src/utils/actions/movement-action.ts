"use server";
import { FormMovementState } from "@/types/general";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { deleteMovement, insertMovement } from "@/services/movements";
import { redirect } from "next/navigation";
import { updateAccountBalance } from "@/services/accounts";
import { Movement } from "@/types/database";
import { setToastMessage } from "@/lib/toast";
import { getTranslations } from "next-intl/server";

const IncomeExpenseSchema = z.object({
  amount: z.coerce
    .number({
      invalid_type_error: "amountNumberError",
    })
    .positive({ message: "amountPositiveError" }),
  comment: z
    .string({
      required_error: "noCommentError",
    })
    .min(1, {
      message: "noCommentError",
    }),
  type: z.enum(["expense", "income"]),
  category: z.coerce
    .number({
      required_error: "noCategoryError",
      invalid_type_error: "noCategoryError",
    })
    .positive({ message: "noCategoryError" }),
  from: z.coerce
    .number({
      required_error: "noAccountError",
      invalid_type_error: "noAccountError",
    })
    .positive({ message: "noAccountError" }),
  done_at: z
    .string({
      required_error: "noDateError",
    })
    .min(1, {
      message: "noDateError",
    }),
});

const TransferSchema = z.object({
  amount: z.coerce
    .number({
      invalid_type_error: "amountNumberError",
    })
    .positive({ message: "amountPositiveError" }),
  comment: z
    .string({
      required_error: "noCommentError",
    })
    .min(1, {
      message: "noCommentError",
    }),
  type: z.enum(["transfer"]),
  from: z.coerce
    .number({
      required_error: "noAccountError",
      invalid_type_error: "noAccountError",
    })
    .positive({ message: "noAccountError" }),
  where: z.coerce
    .number({
      required_error: "noAccountError",
      invalid_type_error: "noAccountError",
    })
    .positive({ message: "noAccountError" }),
  done_at: z
    .string({
      required_error: "noDateError",
    })
    .min(1, {
      message: "noDateError",
    }),
});

export const createMovementForm = async (
  prevState: FormMovementState,
  formData: FormData
): Promise<FormMovementState> => {
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
    const data = validatedData.data;
    await insertMovement(data);
    if (data.type === "transfer") {
      await Promise.all([
        updateAccountBalance(data.from, data.amount, false),
        updateAccountBalance(data.where, data.amount, true),
      ]);
    } else if (data.type === "expense") {
      await updateAccountBalance(data.from, data.amount, false);
    } else if (data.type === "income") {
      await updateAccountBalance(data.from, data.amount, true);
    }
  } catch (error) {
    console.error("Database error: failed to insert movement", error);
    throw new Error("Database error: failed to insert movement");
  }

  const t = await getTranslations("movements");

  setToastMessage("success", t("createdSuccess"));
  revalidatePath("/");
  redirect("/");
};

export const deleteMovementForm = async (movement: Movement) => {
  await deleteMovement(movement.id?.toString() ?? "");

  if (!movement.from) {
    revalidatePath("/");
    redirect("/");
  } else if (movement.type === "transfer") {
    await Promise.all([
      updateAccountBalance(movement.from, movement.amount, true),
      updateAccountBalance(movement.where as number, movement.amount, false),
    ]);
  } else if (movement.type === "expense") {
    await updateAccountBalance(movement.from, movement.amount, true);
  } else if (movement.type === "income") {
    await updateAccountBalance(movement.from, movement.amount, false);
  }

  const t = await getTranslations("movements");

  setToastMessage("success", t("deletedSuccess"));
  revalidatePath("/");
  redirect("/");
};

export const updateMovementForm = async (
  prevState: FormMovementState,
  formData: FormData
): Promise<FormMovementState> => {
  const rawFormData = Object.fromEntries(formData.entries());

  const previous = {
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
    const data = validatedData.data;
    await insertMovement(data);
    if (data.type === "transfer") {
      await Promise.all([
        updateAccountBalance(data.from, data.amount, false),
        updateAccountBalance(data.where, data.amount, true),
      ]);
    } else if (data.type === "expense") {
      await updateAccountBalance(data.from, data.amount, false);
    } else if (data.type === "income") {
      await updateAccountBalance(data.from, data.amount, true);
    }

    await deleteMovement(previous.id);
    if (previous.type === "transfer") {
      await Promise.all([
        updateAccountBalance(previous.from, previous.amount, true),
        updateAccountBalance(previous.where, previous.amount, false),
      ]);
    } else if (previous.type === "expense") {
      await updateAccountBalance(previous.from, previous.amount, true);
    } else if (previous.type === "income") {
      await updateAccountBalance(previous.from, previous.amount, false);
    }
  } catch (error) {
    console.error("Database error: failed to insert movement", error);
    throw new Error("Database error: failed to insert movement");
  }

  const t = await getTranslations("movements");

  setToastMessage("success", t("updatedSuccess"));
  revalidatePath("/");
  redirect("/");
};
