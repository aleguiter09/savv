import { Type } from "./general";

export interface Movement {
  id?: number;
  from: number;
  amount: number;
  comment: string;
  category?: number;
  type: Type;
  done_at: string;
  where?: number;
  fullCategory?: Category;
  fullAccount?: Account;
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
  id?: number;
  name: string;
  balance: number;
  default?: boolean;
}
