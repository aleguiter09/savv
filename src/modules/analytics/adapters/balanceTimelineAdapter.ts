import { format } from "date-fns";

export function balanceTimelineAdapter(data: any[], bucket: string) {
  const sorted = data.toSorted(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return sorted.map((d) => ({
    date:
      bucket === "month"
        ? format(new Date(d.bucket_date), "MMM yy")
        : bucket === "week"
          ? format(new Date(d.bucket_date), "dd MMM")
          : format(new Date(d.bucket_date), "dd MMM"),
    Balance: Number(d.balance).toFixed(2),
  }));
}
