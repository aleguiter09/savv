import { PaidWith, Type } from "./general";

export interface Movement {
  category: string | null;
  amount: number;
  type: Type;
  paid_with: PaidWith;
  comment: string;
  done_at: string;
}

export interface MovementDB extends Movement {
  id: number;
  fullCategory: Category;
}

export type Category = {
  id: number;
  title: string;
  icon: string;
  color:
    | "red"
    | "blue"
    | "green"
    | "purple"
    | "orange"
    | "cyan"
    | "pink"
    | "yellow";
  for: "income" | "expense";
};

export type BalanceByDate = {
  total_expenses: number;
  total_incomes: number;
  current_total: number;
};
