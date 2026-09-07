import { describe, expect, it } from "vitest";
import {
  aggregateMonthlyCashflow,
  getMonthlyCashflowRange,
} from "@/modules/analytics/adapters/monthlyCashflowAdapter";

describe("aggregateMonthlyCashflow", () => {
  const now = new Date("2026-09-15T12:00:00.000Z");

  it("builds the last 6 months newest first and aggregates income/expenses", () => {
    const rows = aggregateMonthlyCashflow(
      [
        {
          amount: 2000,
          type: "income",
          done_at: "2026-09-01T10:00:00.000Z",
        },
        {
          amount: -500,
          type: "expense",
          done_at: "2026-09-05T10:00:00.000Z",
        },
        {
          amount: 1500,
          type: "income",
          done_at: "2026-08-02T10:00:00.000Z",
        },
        {
          amount: -900,
          type: "expense",
          done_at: "2026-08-12T10:00:00.000Z",
        },
        {
          amount: 100,
          type: "transfer",
          done_at: "2026-09-03T10:00:00.000Z",
        },
      ],
      6,
      now,
    );

    expect(rows).toHaveLength(6);
    expect(rows.map((row) => row.monthKey)).toEqual([
      "2026-09",
      "2026-08",
      "2026-07",
      "2026-06",
      "2026-05",
      "2026-04",
    ]);

    expect(rows[0]).toMatchObject({
      income: 2000,
      expenses: 500,
      difference: 1500,
      differencePercent: 75,
    });

    expect(rows[1]).toMatchObject({
      income: 1500,
      expenses: 900,
      difference: 600,
      differencePercent: 40,
    });

    expect(rows[2]).toMatchObject({
      income: 0,
      expenses: 0,
      difference: 0,
      differencePercent: null,
    });
  });
});

describe("getMonthlyCashflowRange", () => {
  it("returns ISO bounds covering the last 6 calendar months", () => {
    const range = getMonthlyCashflowRange(
      6,
      new Date("2026-09-15T12:00:00.000Z"),
    );

    expect(range.from).toBe("2026-04-01T00:00:00.000Z");
    expect(range.to).toBe("2026-09-30T23:59:59.999Z");
  });
});
