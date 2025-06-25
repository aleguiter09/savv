import { LangSelector } from "@/components/language/LangSelector";
import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function LangPage() {
  const t = await getTranslations("settings");

  return (
    <div className="mb-4 flex flex-col">
      <h3 className="font-semibold">
        {t("title")} / {t("languages")}
      </h3>
      <Card className="p-5 mt-4">
        <LangSelector />
      </Card>
    </div>
  );
}
