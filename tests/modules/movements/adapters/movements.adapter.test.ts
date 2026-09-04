import { describe, expect, it } from "vitest";
import {
  adaptMovementItem,
  getMovementsByDay,
} from "@/modules/movements/adapters/movements.adapter";
import { expenseMovementApi, transferMovementApi } from "../../../helpers/fixtures";

describe("movements.adapter", () => {
  it("adapts transfer with toAccount and transfer category placeholder", () => {
    const view = adaptMovementItem(transferMovementApi());

    expect(view.type).toBe("transfer");
    if (view.type === "transfer") {
      expect(view.toAccount).toEqual({
        id: "2",
        name: "Ahorros",
        balance: 1500,
      });
      expect(view.category.title).toBe("transfer");
      expect(view.category.icon).toBe("transfer");
    }
  });

  it("groups same calendar day movements with different times", () => {
    const grouped = getMovementsByDay([
      expenseMovementApi({ id: 1, amount: -30, done_at: "2026-08-10T10:00:00.000Z" }),
      expenseMovementApi({ id: 2, amount: -15.5, done_at: "2026-08-10T18:30:00.000Z" }),
    ]);

    expect(grouped).toHaveLength(1);
    expect(grouped[0]?.date).toBe("2026-08-10");
    expect(grouped[0]?.amount).toBe(-45.5);
    expect(grouped[0]?.items).toHaveLength(2);
  });

  it("groups same-day expenses and sums their amounts", () => {
    const sameDay = "2026-08-10T10:00:00.000Z";
    const grouped = getMovementsByDay([
      expenseMovementApi({ id: 1, amount: -30, done_at: sameDay }),
      expenseMovementApi({ id: 2, amount: -15.5, done_at: sameDay }),
    ]);

    expect(grouped).toHaveLength(1);
    expect(grouped[0]?.amount).toBe(-45.5);
    expect(grouped[0]?.items).toHaveLength(2);
  });

  it("sorts movement groups by date descending", () => {
    const grouped = getMovementsByDay([
      expenseMovementApi({ id: 1, done_at: "2026-08-05T10:00:00.000Z" }),
      expenseMovementApi({ id: 2, done_at: "2026-08-10T10:00:00.000Z" }),
    ]);

    expect(grouped[0]?.date).toBe("2026-08-10");
    expect(grouped[1]?.date).toBe("2026-08-05");
  });

  it("sorts movement groups by date ascending when requested", () => {
    const grouped = getMovementsByDay(
      [
        expenseMovementApi({ id: 1, done_at: "2026-08-05T10:00:00.000Z" }),
        expenseMovementApi({ id: 2, done_at: "2026-08-10T10:00:00.000Z" }),
      ],
      "asc",
    );

    expect(grouped[0]?.date).toBe("2026-08-05");
    expect(grouped[1]?.date).toBe("2026-08-10");
  });
});
