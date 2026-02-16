import type { Movement } from "@/modules/shared/types/global.types";

export const getInitialAndFinalDate = (year?: number, month?: number) => {
  const initialDate = new Date(
    Date.UTC(
      year ?? new Date().getFullYear(),
      month || month === 0 ? month : new Date().getMonth(),
      1,
    ),
  ).toISOString();

  const finishDate = new Date(
    Date.UTC(
      year ?? new Date().getFullYear(),
      month || month === 0 ? month + 1 : new Date().getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    ),
  ).toISOString();

  return { initialDate, finishDate };
};

type ParsedMovement = {
  title: string;
  amount: number;
  color: string;
  category: string;
};

export const parseMovementsForChart = (
  movements: Movement[],
): ParsedMovement[] => {
  const result: ParsedMovement[] = [];

  for (const movement of movements) {
    const { amount, fullCategory, category } = movement;
    const dataItem = result.find((item) => item.title === fullCategory?.title);

    if (dataItem) {
      dataItem.amount += amount;
    } else {
      result.push({
        title: fullCategory?.title ?? "Uncategorized",
        color: fullCategory?.color ?? "gray",
        category: category ? category.toString() : "uncategorized",
        amount: amount,
      });
    }
  }

  return result.sort((a, b) => b.amount - a.amount);
};
