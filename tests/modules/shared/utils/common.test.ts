import { describe, expect, it } from "vitest";
import { parseMovementsForChart } from "@/modules/shared/utils/common";
import { expenseMovementView } from "../../../helpers/fixtures";

describe("parseMovementsForChart", () => {
  it("aggregates same-category expenses into one chart bucket", () => {
    const chart = parseMovementsForChart([
      expenseMovementView({ amount: -30 }),
      expenseMovementView({ id: 2, amount: -15.5 }),
    ]);

    expect(chart).toHaveLength(1);
    expect(chart[0]?.title).toBe("Comida");
    expect(chart[0]?.amount).toBe(45.5);
  });
});
