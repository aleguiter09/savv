import { Type } from "./general";

export interface Movement {
  from: number;
  amount: number;
  comment: string;
  category?: number;
  type: Type;
  done_at: string;
  where?: number;
}

export interface MovementDB extends Movement {
  id: number;
  fullCategory: Category;
  fullAccount: Account;
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

export interface Account {
  name: string;
  balance: number;
  default?: boolean;
}

export interface AccountDB extends Account {
  id: number;
}
