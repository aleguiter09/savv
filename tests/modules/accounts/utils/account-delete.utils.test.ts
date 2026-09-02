import { describe, expect, it } from "vitest";
import { getAccountDeleteBlockReason } from "@/modules/accounts/utils/account-delete.utils";

describe("getAccountDeleteBlockReason", () => {
  it("blocks when it is the only account", () => {
    expect(
      getAccountDeleteBlockReason({
        accountCount: 1,
        movementCount: 0,
        seriesCount: 0,
      }),
    ).toBe("lastAccountError");
  });

  it("blocks when the account has movements", () => {
    expect(
      getAccountDeleteBlockReason({
        accountCount: 2,
        movementCount: 3,
        seriesCount: 0,
      }),
    ).toBe("hasMovementsError");
  });

  it("blocks when the account has series", () => {
    expect(
      getAccountDeleteBlockReason({
        accountCount: 2,
        movementCount: 0,
        seriesCount: 1,
      }),
    ).toBe("hasSeriesError");
  });

  it("prioritizes last account over movements", () => {
    expect(
      getAccountDeleteBlockReason({
        accountCount: 1,
        movementCount: 5,
        seriesCount: 0,
      }),
    ).toBe("lastAccountError");
  });

  it("prioritizes movements over series", () => {
    expect(
      getAccountDeleteBlockReason({
        accountCount: 2,
        movementCount: 1,
        seriesCount: 2,
      }),
    ).toBe("hasMovementsError");
  });

  it("returns null when the account can be deleted", () => {
    expect(
      getAccountDeleteBlockReason({
        accountCount: 2,
        movementCount: 0,
        seriesCount: 0,
      }),
    ).toBeNull();
  });
});
