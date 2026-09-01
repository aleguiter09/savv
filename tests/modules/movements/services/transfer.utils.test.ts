import { describe, expect, it } from "vitest";
import { mergeTransferLegs } from "@/modules/movements/services/transfer.utils";
import {
  transferLegIn,
  transferLegOut,
  transferMovementApi,
} from "../../../helpers/fixtures";

describe("mergeTransferLegs", () => {
  it("merges out and in legs into origin and destination accounts", () => {
    const base = transferMovementApi({ fullToAccount: undefined });
    const merged = mergeTransferLegs(base, [transferLegOut(), transferLegIn()]);

    expect(merged.fullAccount).toEqual({
      id: 1,
      name: "Cuenta principal",
      balance: 500,
    });
    expect(merged.fullToAccount).toEqual({
      id: 2,
      name: "Ahorros",
      balance: 1500,
    });
    expect(merged.amount).toBe(-500);
  });

  it("returns base unchanged when transfer group has only one leg", () => {
    const base = transferMovementApi({ fullToAccount: undefined });
    const merged = mergeTransferLegs(base, [transferLegOut()]);

    expect(merged).toEqual(base);
    expect(merged.fullToAccount).toBeUndefined();
  });
});
