export const valueFormatter = (number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`;

export const calculatePercentage = (a, b) => {
  return Math.floor((a / (a + b)) * 100);
};
