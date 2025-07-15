import { z } from "zod";

const BaseMovementSchema = z.object({
  amount: z.coerce
    .number()
    .positive("amountPositiveError")
    .max(999999999, "amountTooLarge"),
  comment: z.string().min(1, "noCommentError").max(500, "commentTooLong"),
  done_at: z.string().min(1, "noDateError").datetime("invalidDateError"),
  from: z.coerce.number().positive("noAccountError"),
});

export const IncomeExpenseSchema = BaseMovementSchema.extend({
  type: z.enum(["expense", "income"]),
  category: z.coerce.number().positive("noCategoryError"),
});

export const TransferSchema = BaseMovementSchema.extend({
  type: z.literal("transfer"),
  where: z.coerce.number().positive("noAccountError"),
});

export const MovementSchema = z
  .discriminatedUnion("type", [IncomeExpenseSchema, TransferSchema])
  .refine(
    (data) => {
      if (data.type === "transfer") {
        return data.from !== data.where;
      }
      return true;
    },
    {
      message: "transferSameAccountError",
      path: ["where"],
    }
  );

export const AccountSchema = z.object({
  name: z.string().min(1, "nameError").max(100, "nameTooLong"),
  balance: z.coerce
    .number()
    .min(-999999999, "balanceTooLow")
    .max(999999999, "balanceTooHigh"),
  default: z.boolean().default(false),
});

export const CategorySchema = z.object({
  title: z.string().min(1, "titleError").max(20, "titleTooLong"),
  icon: z.string().min(1, "iconError"),
  color: z.string().min(1, "colorError"),
  parent_id: z.coerce.number().optional(),
});

export const UserSchema = z
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

export const LoginUserSchema = z.object({
  email: z.string().email({ message: "emailError" }),
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
