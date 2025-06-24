import { CATEGORY_ICONS } from "@/utils/constants";

export type YearMonth = { year: number; month: number };

export type CategoryIcons = {
  [key: string]: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export type CategoryIconsKeys = keyof typeof CATEGORY_ICONS;

export type Type = "income" | "expense" | "transfer";

export type MovementFormFields =
  | "done_at"
  | "amount"
  | "type"
  | "category"
  | "comment";

export type FormAccountState = {
  errors?: { name?: string[]; balance?: string[]; default?: string[] };
  message?: string | null;
};

export type FormMovementState = {
  errors?: {
    amount?: string[];
    comment?: string[];
    done_at?: string[];
    category?: string[];
    from?: string[];
    where?: string[];
  };
  message?: string | null;
};

export type FormUserState = {
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
};

export type LoginFormUserState = {
  errors?: { email?: string[]; password?: string[] };
  message?: string | null;
};

export type ResetFormUserState = {
  errors?: { email?: string[] };
  message?: string | null;
};

export type UpdatePasswordFormUserState = {
  errors?: { password?: string[]; confirmPassword?: string[] };
  message?: string | null;
};

export type CategoryIds = "all" | "incomes" | "expenses" | number;

export type AccountIds = "all" | number;
