import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";
import { PhoneFrame } from "../PhoneFrame";

export async function MovementsPreviewMock() {
  const t = await getTranslations("landing.mocks");

  const rows = [
    { label: t("salary"), amount: "+2.800,00", tone: "text-green-600", chip: "bg-green-100" },
    { label: t("groceries"), amount: "−64,50", tone: "text-red-600", chip: "bg-red-100" },
    { label: t("transfer"), amount: "500,00", tone: "text-blue-600", chip: "bg-blue-100" },
    { label: t("housing"), amount: "−850,00", tone: "text-red-600", chip: "bg-red-100" },
  ];

  return (
    <PhoneFrame>
      <Card className="px-3 py-3 shadow-md">
        <p className="mb-3 text-sm font-semibold">{t("recent")}</p>
        <ul className="space-y-3 text-sm">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className={`h-8 w-8 shrink-0 rounded-full ${row.chip}`} />
                <span className="truncate text-gray-700">{row.label}</span>
              </div>
              <span className={`shrink-0 font-medium tabular-nums ${row.tone}`}>
                {row.amount}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </PhoneFrame>
  );
}
