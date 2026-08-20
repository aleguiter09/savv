import { getTranslations } from "next-intl/server";
import { Card } from "@/ui/card";

export async function AnalyticsPreviewMock() {
  const t = await getTranslations("landing.mocks");

  const categories = [
    { name: t("food"), width: "72%", color: "bg-blue-600" },
    { name: t("housing"), width: "54%", color: "bg-blue-500" },
    { name: t("transport"), width: "28%", color: "bg-blue-400" },
  ];

  return (
    <div aria-hidden="true" className="rounded-2xl border bg-gray-50 p-4">
      <Card className="mb-3 border-b-4 border-b-blue-600 px-4 py-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">{t("income")}</p>
            <p className="mt-1 text-lg font-semibold text-green-600">3.200</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t("expense")}</p>
            <p className="mt-1 text-lg font-semibold text-red-600">1.850</p>
          </div>
        </div>
      </Card>
      <Card className="px-4 py-3 shadow-md">
        <p className="mb-3 text-sm font-semibold">{t("expense")}</p>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{category.name}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className={`h-2 rounded-full ${category.color}`}
                  style={{ width: category.width }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
