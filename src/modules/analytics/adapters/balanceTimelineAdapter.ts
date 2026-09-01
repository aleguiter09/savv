import { format } from "date-fns";

export function balanceTimelineAdapter(
  data: any[],
  bucket: "day" | "week" | "month",
  balanceKey: string,
) {
  const sorted = data.toSorted(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return sorted.map((d) => ({
    date: formatDate(d.bucket_date, bucket),
    [balanceKey]: Number(d.balance).toFixed(2),
  }));
}

const formatDate = (date: string, bucket: "day" | "week" | "month") => {
  const d = new Date(date);

  if (bucket === "month") {
    return format(d, "MMM yy");
  } else if (bucket === "week") {
    return format(d, "MMM dd");
  } else {
    return format(d, "MMM dd");
  }
};
