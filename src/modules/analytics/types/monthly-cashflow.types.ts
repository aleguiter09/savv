export type MonthlyCashflowRow = {
  monthKey: string;
  monthStart: Date;
  income: number;
  expenses: number;
  difference: number;
  differencePercent: number | null;
};

export type MonthlyCashflowSummary = {
  income: number;
  expenses: number;
  difference: number;
  differencePercent: number | null;
};

export type MonthlyCashflowMovement = {
  amount: number;
  type: "income" | "expense" | "transfer";
  done_at: string;
};
