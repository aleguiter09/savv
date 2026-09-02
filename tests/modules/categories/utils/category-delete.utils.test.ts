import { describe, expect, it } from "vitest";
import { getCategoryDeleteBlockReason } from "@/modules/categories/utils/category-delete.utils";

describe("getCategoryDeleteBlockReason", () => {
  it("blocks global categories", () => {
    expect(
      getCategoryDeleteBlockReason({
        isGlobal: true,
        movementCount: 0,
        seriesCount: 0,
        childCount: 0,
      }),
    ).toBe("globalCategoryError");
  });

  it("blocks when the category has movements", () => {
    expect(
      getCategoryDeleteBlockReason({
        isGlobal: false,
        movementCount: 2,
        seriesCount: 0,
        childCount: 0,
      }),
    ).toBe("hasMovementsError");
  });

  it("blocks when the category has series", () => {
    expect(
      getCategoryDeleteBlockReason({
        isGlobal: false,
        movementCount: 0,
        seriesCount: 1,
        childCount: 0,
      }),
    ).toBe("hasSeriesError");
  });

  it("blocks when the category has subcategories", () => {
    expect(
      getCategoryDeleteBlockReason({
        isGlobal: false,
        movementCount: 0,
        seriesCount: 0,
        childCount: 3,
      }),
    ).toBe("hasSubcategoriesError");
  });

  it("prioritizes global over other constraints", () => {
    expect(
      getCategoryDeleteBlockReason({
        isGlobal: true,
        movementCount: 5,
        seriesCount: 2,
        childCount: 1,
      }),
    ).toBe("globalCategoryError");
  });

  it("returns null when the category can be deleted", () => {
    expect(
      getCategoryDeleteBlockReason({
        isGlobal: false,
        movementCount: 0,
        seriesCount: 0,
        childCount: 0,
      }),
    ).toBeNull();
  });
});
