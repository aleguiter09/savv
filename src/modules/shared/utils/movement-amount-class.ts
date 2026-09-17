type MovementType = "income" | "expense" | "transfer";

export function getMovementAmountClass(type: MovementType): string {
  if (type === "income") return "text-income";
  if (type === "expense") return "text-expense";
  return "text-transfer";
}

export function getSignedAmountClass(amount: number): string {
  if (amount > 0) return "text-income";
  if (amount < 0) return "text-expense";
  return "text-muted-foreground";
}
