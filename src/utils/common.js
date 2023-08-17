export const valueFormatter = (number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`;

export const calculatePercentage = (a, b) => {
  return Math.floor((a / (a + b)) * 100);
};

export const getMovementsByDay = (movements) => {
  const items = [];
  movements.forEach((m) => {
    const currentDate = items.find(
      (item) => item.date.slice(0, 10) === m.created_at.slice(0, 10),
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
        date: m.created_at.slice(0, 10),
        movements: [m],
        total: m.type === "expense" ? -m.amount : m.amount,
      });
    }
  });

  return items;
};
