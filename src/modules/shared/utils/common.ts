import { MovementView } from "@/modules/movements/types/types";

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
  movements: MovementView[],
): ParsedMovement[] => {
  const result: ParsedMovement[] = [];

  for (const movement of movements) {
    const { amount, category } = movement;
    const dataItem = result.find((item) => item.title === category?.title);

    if (dataItem) {
      dataItem.amount += amount;
    } else {
      result.push({
        title: category?.title ?? "Uncategorized",
        color: category?.color ?? "gray",
        category: category?.id?.toString() ?? "uncategorized",
        amount: amount,
      });
    }
  }

  return result.sort((a, b) => b.amount - a.amount);
};
