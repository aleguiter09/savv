export function accountFilterToRpc(accountId: string): number | undefined {
  if (accountId === "all") return undefined;
  const parsed = Number.parseInt(accountId, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}
