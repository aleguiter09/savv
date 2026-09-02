export function getAccountDeleteBlockReason(input: {
  accountCount: number;
  movementCount: number;
  seriesCount: number;
}): string | null {
  if (input.accountCount <= 1) {
    return "lastAccountError";
  }

  if (input.movementCount > 0) {
    return "hasMovementsError";
  }

  if (input.seriesCount > 0) {
    return "hasSeriesError";
  }

  return null;
}
