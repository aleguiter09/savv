import type { AccountDB } from "@/modules/shared/types/global.types";
import type { MovementApi } from "../types/types";

type TransferLegAccount = Pick<AccountDB, "id" | "name" | "balance">;

type TransferLeg = {
  id: number;
  from: number;
  amount: number;
  description: string | null;
  done_at: string;
  balance_after: number | null;
  applied: boolean;
  fullAccount?: TransferLegAccount | TransferLegAccount[];
};

export function mergeTransferLegs(
  base: MovementApi,
  legs: TransferLeg[],
): MovementApi {
  if (legs.length < 2) {
    return base;
  }

  const outLeg = legs.find((leg) => leg.amount < 0);
  const inLeg = legs.find((leg) => leg.amount > 0);

  if (!outLeg || !inLeg) {
    return base;
  }

  const outAccount = Array.isArray(outLeg.fullAccount)
    ? outLeg.fullAccount[0]
    : outLeg.fullAccount;
  const inAccount = Array.isArray(inLeg.fullAccount)
    ? inLeg.fullAccount[0]
    : inLeg.fullAccount;

  return {
    ...base,
    id: outLeg.id,
    from: outLeg.from,
    amount: outLeg.amount,
    balance_after: outLeg.balance_after,
    description: outLeg.description ?? "",
    done_at: outLeg.done_at,
    applied: outLeg.applied,
    fullAccount: outAccount as MovementApi["fullAccount"],
    fullToAccount: inAccount as MovementApi["fullToAccount"],
  };
}
