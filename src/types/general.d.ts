export type YearMonth = {
  year: number;
  month: number;
};

export type CategoryIcons = {
  [key: string]: string;
};

export type Type = "income" | "expense" | "transfer";

export type MovementFormFields =
  | "done_at"
  | "amount"
  | "type"
  | "category"
  | "comment";

export type FormAccountState = {
  errors?: {
    name?: string[];
    balance?: string[];
  };
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
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};
