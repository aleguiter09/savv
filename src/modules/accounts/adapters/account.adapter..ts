import { AccountApi, AccountView } from "../types/types";

export function adaptAccount(account: AccountApi): AccountView {
  return {
    id: account.id?.toString() ?? "",
    name: account.name ?? "",
    balance: account.balance ?? 0,
    isDefault: account.is_default ?? false,
  };
}
