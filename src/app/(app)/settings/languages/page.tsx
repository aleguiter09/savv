import { LangSelector } from "@/modules/settings/ui/LangSelector";
import { Card } from "@/ui/card";
import { getTranslations } from "next-intl/server";

export default async function LangPage() {
  const t = await getTranslations("settings");

  return (
    <div className="mb-4 flex flex-col">
      <div className="flex items-center gap-1 text-sm">
        <h3>{t("title")}</h3>
        <span className="text-gray-500">/</span>
        <h3 className="font-semibold">{t("languages")}</h3>
      </div>
      <Card className="p-5 mt-4">
        <LangSelector />
      </Card>
    </div>
  );
}
