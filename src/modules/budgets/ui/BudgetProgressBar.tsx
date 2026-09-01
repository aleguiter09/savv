import { getCategoryBgClass } from "@/modules/shared/utils/constants";

type Props = Readonly<{
  spent: number;
  budget: number;
  color: string;
  isOverBudget: boolean;
}>;

export function BudgetProgressBar({ spent, budget, color, isOverBudget }: Props) {
  const percent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const barColor = isOverBudget ? "bg-red-500" : getCategoryBgClass(color);

  return (
    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${barColor}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
