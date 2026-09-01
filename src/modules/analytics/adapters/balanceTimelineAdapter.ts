import { format } from "date-fns";

type BalanceTimelineBucket = "day" | "week" | "month";

type BalanceTimelineRow = {
  bucket_date: string;
  balance: number | string;
};

export function balanceTimelineAdapter(
  data: BalanceTimelineRow[],
  bucket: BalanceTimelineBucket,
) {
  const sorted = data.toSorted(
    (a, b) =>
      new Date(a.bucket_date).getTime() - new Date(b.bucket_date).getTime(),
  );

  return sorted.map((d) => ({
    date: formatDate(d.bucket_date, bucket),
    balance: Number(d.balance),
  }));
}

const formatDate = (date: string, bucket: BalanceTimelineBucket) => {
  const d = new Date(date);

  if (bucket === "month") {
    return format(d, "MMM yy");
  }

  return format(d, "MMM dd");
};
