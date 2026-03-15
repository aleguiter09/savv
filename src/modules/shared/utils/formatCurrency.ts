export function formatCurrency(
  locale: string,
  amount: number,
  fractionDigits: number = 0,
) {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: fractionDigits,
  }).format(amount);

  return formatted.replace(/\s+€/, "€").replace(/€\s+/, "€");
}
