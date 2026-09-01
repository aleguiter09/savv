import { describe, expect, it } from "vitest";
import { getAvailableBudgetCategories } from "@/modules/budgets/utils/getAvailableBudgetCategories";
import { budgetView, categoryView } from "../../../helpers/fixtures";

describe("getAvailableBudgetCategories", () => {
  const expenseCategories = [
    categoryView({ id: "10", title: "Comida" }),
    categoryView({ id: "11", title: "Transporte" }),
    categoryView({ id: "12", title: "Ocio", isHidden: true }),
  ];

  it("excludes categories that already have a budget", () => {
    const available = getAvailableBudgetCategories(
      expenseCategories,
      [budgetView({ categoryId: "10" })],
    );

    expect(available.map((c) => c.id)).toEqual(["11"]);
  });

  it("keeps the edited budget category available while editing", () => {
    const editing = budgetView({ id: "5", categoryId: "10" });
    const available = getAvailableBudgetCategories(
      expenseCategories,
      [editing, budgetView({ id: "6", categoryId: "11" })],
      editing,
    );

    expect(available.map((c) => c.id)).toEqual(["10"]);
  });
});
