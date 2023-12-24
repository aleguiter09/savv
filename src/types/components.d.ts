import { Movement } from "./database";

export type FinanceItemProps = {
  date: string;
  items: Movement[];
  amount: number;
};

export type MovementsModalProps = {
  expenseCategories: Category[];
  incomeCategories: Category[];
};
