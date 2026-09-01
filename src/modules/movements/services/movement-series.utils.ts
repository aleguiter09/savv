export function isMovementAppliedByDate(doneAtIso: string): boolean {
  const done = new Date(doneAtIso);
  const today = new Date();
  const doneDay = Date.UTC(done.getUTCFullYear(), done.getUTCMonth(), done.getUTCDate());
  const todayDay = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
  return doneDay <= todayDay;
}

export function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

export function splitInstallmentAmounts(total: number, count: number): number[] {
  const cents = Math.round(total * 100);
  const base = Math.floor(cents / count);
  const amounts = Array.from({ length: count }, () => base / 100);
  const remainder = (cents - base * count) / 100;
  amounts[count - 1] = Number((amounts[count - 1] + remainder).toFixed(2));
  return amounts;
}
