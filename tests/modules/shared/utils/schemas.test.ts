import { describe, expect, it } from "vitest";
import { MovementSchema } from "@/modules/shared/utils/schemas";
import {
  validIncomePayload,
  validInstallmentPayload,
  validOnceExpensePayload,
  validRecurringPayload,
  validTransferPayload,
} from "../../../helpers/fixtures";

describe("MovementSchema", () => {
  it("rejects transfer between the same account", () => {
    const result = MovementSchema.safeParse({
      ...validTransferPayload,
      where: validTransferPayload.from,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "transferSameAccountError")).toBe(
        true,
      );
    }
  });

  it("rejects recurring expense when end_date is before done_at", () => {
    const result = MovementSchema.safeParse({
      ...validRecurringPayload,
      done_at: "2026-08-15T12:00:00.000Z",
      end_date: "2026-08-01T12:00:00.000Z",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "endDateBeforeStartError")).toBe(
        true,
      );
    }
  });

  it("accepts typical 12-installment expense", () => {
    const result = MovementSchema.safeParse(validInstallmentPayload);
    expect(result.success).toBe(true);
    if (
      result.success &&
      result.data.type === "expense" &&
      result.data.schedule === "installment"
    ) {
      expect(result.data.installment_count).toBe(12);
    }
  });

  it("rejects installment expense with a single payment", () => {
    const result = MovementSchema.safeParse({
      ...validInstallmentPayload,
      installment_count: 1,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "installmentCountMin")).toBe(
        true,
      );
    }
  });

  it("accepts valid once expense, income and transfer payloads", () => {
    expect(MovementSchema.safeParse(validOnceExpensePayload).success).toBe(true);
    expect(MovementSchema.safeParse(validIncomePayload).success).toBe(true);
    expect(MovementSchema.safeParse(validTransferPayload).success).toBe(true);
  });
});
