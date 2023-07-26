export const valueFormatter = (number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`;
