import { getAccountBalanceById } from "@/modules/accounts/services/accounts";

export async function calculateBalanceAfter(
  accountId: string,
  movementType: "income" | "expense" | "transfer",
  amount: number,
): Promise<number> {
  const currentBalance = await getAccountBalanceById(accountId);

  let balanceAfter = currentBalance;

  switch (movementType) {
    case "income":
      balanceAfter += amount;
      break;
    case "expense":
      balanceAfter -= amount;
      break;
    case "transfer":
      balanceAfter -= amount;
      break;
  }

  return balanceAfter;
}

export async function calculateToAccountBalanceAfter(
  toAccountId: string,
  amount: number,
): Promise<number> {
  const currentBalance = await getAccountBalanceById(toAccountId);
  return currentBalance + amount;
}
