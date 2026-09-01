import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isMovementAppliedByDate,
  splitInstallmentAmounts,
} from "@/modules/movements/services/movement-series.utils";
import { FIXED_TODAY } from "../../../helpers/fixtures";

describe("movement-series.utils", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_TODAY);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("marks past movements as applied", () => {
    expect(isMovementAppliedByDate("2026-08-10T23:59:59.000Z")).toBe(true);
  });

  it("marks future movements as not applied (pending CRON)", () => {
    expect(isMovementAppliedByDate("2026-08-20T00:00:00.000Z")).toBe(false);
  });

  it("splits 1200€ into 12 equal installments", () => {
    expect(splitInstallmentAmounts(1200, 12)).toEqual(Array(12).fill(100));
  });

  it("puts remainder cents on the last installment for 100€ / 3", () => {
    expect(splitInstallmentAmounts(100, 3)).toEqual([33.33, 33.33, 33.34]);
  });
});
