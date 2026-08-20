import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";

export async function MovementsPreviewMock() {
  const t = await getTranslations("landing.mocks");

  const rows = [
    { label: t("salary"), amount: "+2.800,00", tone: "text-green-600" },
    { label: t("groceries"), amount: "−64,50", tone: "text-red-600" },
    { label: t("transfer"), amount: "500,00", tone: "text-blue-600" },
    { label: t("housing"), amount: "−850,00", tone: "text-red-600" },
  ];

  return (
    <div aria-hidden="true" className="rounded-2xl border bg-gray-50 p-4">
      <Card className="px-4 py-3 shadow-md">
        <p className="mb-3 text-sm font-semibold">{t("recent")}</p>
        <ul className="space-y-3 text-sm">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between">
              <span className="text-gray-700">{row.label}</span>
              <span className={`font-medium tabular-nums ${row.tone}`}>
                {row.amount}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
