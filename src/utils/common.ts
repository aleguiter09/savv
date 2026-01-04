import type { Movement } from "@/types/global.types";

export const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`;

export const calculatePercentage = (a: number, b: number) => {
  if (b > 0) {
    return Math.floor((a / (a + b)) * 100);
  }
  return 0;
};

export const getInitialAndFinalDate = (year?: number, month?: number) => {
  const initialDate = new Date(
    Date.UTC(
      year ?? new Date().getFullYear(),
      month || month === 0 ? month : new Date().getMonth(),
      1
    )
  ).toISOString();

  const finishDate = new Date(
    Date.UTC(
      year ?? new Date().getFullYear(),
      month || month === 0 ? month + 1 : new Date().getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    )
  ).toISOString();

  return { initialDate, finishDate };
};

export const getMovementsByDay = (movements: Movement[]) => {
  type Items = { date: string; movements: Movement[]; total: number }[];
  const items: Items = [];

  movements.forEach((m) => {
    const currentDate = items.find(
      (item) =>
        item.date ===
        new Date(m.done_at).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
    );
    if (currentDate) {
      currentDate.movements.push(m);
      if (m.type === "expense") {
        currentDate.total -= m.amount;
      } else {
        currentDate.total += m.amount;
      }
    } else {
      items.push({
        date: new Date(m.done_at).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        movements: [m],
        total: m.type === "expense" ? -m.amount : m.amount,
      });
    }
  });

  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

type ParsedMovement = {
  title: string;
  amount: number;
  color: string;
  category: string;
};

export const parseMovementsForChart = (
  movements: Movement[]
): ParsedMovement[] => {
  const result: ParsedMovement[] = [];

  for (const movement of movements) {
    const { amount, fullCategory, category } = movement;
    const dataItem = result.find((item) => item.title === fullCategory?.title);

    if (!dataItem) {
      result.push({
        title: fullCategory?.title ?? "Uncategorized",
        color: fullCategory?.color ?? "gray",
        category: category ? category.toString() : "uncategorized",
        amount: amount,
      });
    } else {
      dataItem.amount += amount;
    }
  }

  return result.sort((a, b) => b.amount - a.amount);
};
