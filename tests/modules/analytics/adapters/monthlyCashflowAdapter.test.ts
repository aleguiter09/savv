import { describe, expect, it } from "vitest";
import { parseCashflowMonths } from "@/modules/analytics/adapters/analytics.adapter";
import {
  aggregateMonthlyCashflow,
  getMonthlyCashflowRange,
  summarizeMonthlyCashflow,
} from "@/modules/analytics/adapters/monthlyCashflowAdapter";

describe("aggregateMonthlyCashflow", () => {
  const now = new Date("2026-09-15T12:00:00.000Z");

  it("defaults to the last 12 months newest first", () => {
    const rows = aggregateMonthlyCashflow([], undefined, now);

    expect(rows).toHaveLength(12);
    expect(rows[0]?.monthKey).toBe("2026-09");
    expect(rows[11]?.monthKey).toBe("2025-10");
  });

  it("builds the requested months and aggregates income/expenses", () => {
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

describe("summarizeMonthlyCashflow", () => {
  it("averages income/expenses and derives savings rate from averages", () => {
    const summary = summarizeMonthlyCashflow([
      {
        monthKey: "2026-09",
        monthStart: new Date("2026-09-01T00:00:00.000Z"),
        income: 2000,
        expenses: 500,
        difference: 1500,
        differencePercent: 75,
      },
      {
        monthKey: "2026-08",
        monthStart: new Date("2026-08-01T00:00:00.000Z"),
        income: 1000,
        expenses: 1000,
        difference: 0,
        differencePercent: 0,
      },
    ]);

    expect(summary.income).toBe(1500);
    expect(summary.expenses).toBe(750);
    expect(summary.difference).toBe(750);
    expect(summary.differencePercent).toBe(50);
  });

  it("returns null savings rate when average income is zero", () => {
    const summary = summarizeMonthlyCashflow([
      {
        monthKey: "2026-09",
        monthStart: new Date("2026-09-01T00:00:00.000Z"),
        income: 0,
        expenses: 100,
        difference: -100,
        differencePercent: null,
      },
    ]);

    expect(summary.differencePercent).toBeNull();
  });
});

describe("getMonthlyCashflowRange", () => {
  it("returns ISO bounds covering the last 12 calendar months by default", () => {
    const range = getMonthlyCashflowRange(
      undefined,
      new Date("2026-09-15T12:00:00.000Z"),
    );

    expect(range.from).toBe("2025-10-01T00:00:00.000Z");
    expect(range.to).toBe("2026-09-30T23:59:59.999Z");
  });
});

describe("parseCashflowMonths", () => {
  it("accepts only 6, 12 or 24 and defaults to 12", () => {
    expect(parseCashflowMonths("6")).toBe(6);
    expect(parseCashflowMonths("12")).toBe(12);
    expect(parseCashflowMonths("24")).toBe(24);
    expect(parseCashflowMonths("3")).toBe(12);
    expect(parseCashflowMonths(undefined)).toBe(12);
  });
});
