export const valueFormatter = (number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`;

export const calculatePercentage = (a, b) => {
  if (a > 0 && b > 0) {
    return Math.floor((a / (a + b)) * 100);
  }
  return 0;
};

export const getMovementsByDay = (movements) => {
  const items = [];
  movements.forEach((m) => {
    const currentDate = items.find(
      (item) =>
        item.date.slice(0, 10) === m.done_at.slice(0, 10).replace(/-/g, "/"),
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
        date: m.done_at.slice(0, 10).replace(/-/g, "/"),
        movements: [m],
        total: m.type === "expense" ? -m.amount : m.amount,
      });
    }
  });

  return items.sort(
    (a, b) => parseInt(b.date.slice(8, 10)) - parseInt(a.date.slice(8, 10)),
  );
};
