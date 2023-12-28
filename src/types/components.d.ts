import { MovementDB } from "./database";

export type FinanceItemProps = {
  date: string;
  items: MovementDB[];
  amount: number;
};

export type MovementsModalProps = {
  expenseCategories: Category[];
  incomeCategories: Category[];
};
