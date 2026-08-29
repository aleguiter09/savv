import { categoryColorsLiterals } from "@/modules/shared/utils/constants";
import { z } from "zod";

export const FrequencySchema = z.enum([
  "weekly",
  "biweekly",
  "monthly",
  "yearly",
]);

const BaseMovementSchema = z.object({
  amount: z.coerce
    .number("amountPositiveError")
    .positive("amountPositiveError")
    .max(999999, "amountTooLarge"),
  description: z
    .string()
    .min(1, "noDescriptionError")
    .max(500, "descriptionTooLong"),
  done_at: z.coerce
    .date({
      error: "noDateError",
    })
    .transform((date) => date.toISOString()),
  from: z.coerce.number("noAccountError").positive("noAccountError"),
});

const OnceExpenseSchema = BaseMovementSchema.extend({
  type: z.literal("expense"),
  category: z.coerce.number("noCategoryError").positive("noCategoryError"),
  schedule: z.literal("once"),
});

const optionalEndDateSchema = z.any().transform((val): string | null => {
  if (val == null || val === "") return null;
  const date = val instanceof Date ? val : new Date(val);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
});

const RecurringExpenseSchema = BaseMovementSchema.extend({
  type: z.literal("expense"),
  category: z.coerce.number("noCategoryError").positive("noCategoryError"),
  schedule: z.literal("recurring"),
  frequency: FrequencySchema,
  end_date: optionalEndDateSchema.optional(),
});

const InstallmentExpenseSchema = BaseMovementSchema.extend({
  type: z.literal("expense"),
  category: z.coerce.number("noCategoryError").positive("noCategoryError"),
  schedule: z.literal("installment"),
  installment_count: z.coerce
    .number("installmentCountError")
    .int("installmentCountError")
    .min(2, "installmentCountMin")
    .max(60, "installmentCountMax"),
});

const IncomeSchema = BaseMovementSchema.extend({
  type: z.literal("income"),
  category: z.coerce.number("noCategoryError").positive("noCategoryError"),
  schedule: z.literal("once").default("once"),
});

const TransferSchema = BaseMovementSchema.extend({
  type: z.literal("transfer"),
  where: z.coerce.number("noAccountError").positive("noAccountError"),
  schedule: z.literal("once").default("once"),
});

export const MovementSchema = z
  .union([
    OnceExpenseSchema,
    RecurringExpenseSchema,
    InstallmentExpenseSchema,
    IncomeSchema,
    TransferSchema,
  ])
  .superRefine((data, ctx) => {
    if (data.type === "transfer" && data.from === data.where) {
      ctx.addIssue({
        code: "custom",
        message: "transferSameAccountError",
        path: ["where"],
      });
    }

    if (
      data.type === "expense" &&
      data.schedule === "recurring" &&
      data.end_date
    ) {
      if (new Date(data.end_date) < new Date(data.done_at)) {
        ctx.addIssue({
          code: "custom",
          message: "endDateBeforeStartError",
          path: ["end_date"],
        });
      }
    }
  });

export const AccountSchema = z.object({
  name: z.string().min(1, "nameError").max(100, "nameTooLong"),
  balance: z.coerce
    .number("balanceError")
    .min(-99999999, "balanceTooLow")
    .max(9999999, "balanceTooHigh"),
});

export const CategorySchema = z.object({
  title: z.string().min(1, "titleError").max(20, "titleTooLong"),
  icon: z.string().min(1, "iconError"),
  color: z.enum(categoryColorsLiterals, { message: "colorError" }),
  parent_id: z.coerce.number().optional(),
  is_hidden: z.boolean().optional(),
});

export const BudgetSchema = z.object({
  category_id: z.coerce.number("noCategoryError").positive("noCategoryError"),
  amount: z.coerce
    .number("amountPositiveError")
    .positive("amountPositiveError")
    .max(999999, "amountTooLarge"),
});

export const UserSchema = z
  .object({
    email: z.email({ message: "emailError" }),
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

export const LoginUserSchema = z.object({
  email: z.email({ message: "emailError" }),
  password: z.string().min(8, { message: "passwordError" }),
});

export const ResetUserSchema = LoginUserSchema.omit({ password: true });

export const UpdatePasswordSchema = z
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
