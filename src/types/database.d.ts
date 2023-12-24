export type Movement = {
  id: number;
  fullCategory: Category;
  comment: string;
  amount: number;
  type: string;
  category: string;
};

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
