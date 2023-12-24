export type YearMonth = {
  year: number;
  month: number;
};

export type CategoryIcons = {
  [key: string]: string;
};

export type Type = "income" | "expense";

export type PaidWith = "cash" | "credit";

export type MovementFormFields =
  | "done_at"
  | "amount"
  | "type"
  | "paid_with"
  | "category"
  | "comment";
