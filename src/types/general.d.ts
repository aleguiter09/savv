export type YearMonth = {
  year: number;
  month: number;
};

export type CategoryIcons = {
  [key: string]: string;
};

export type Type = "income" | "expense" | "transfer";

export type PaidWith = "cash" | "credit";

export type MovementFormFields =
  | "done_at"
  | "amount"
  | "type"
  | "paid_with"
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
    paid_with?: string[];
    category?: string[];
    from?: string[];
    where?: string[];
  };
  message?: string | null;
};
