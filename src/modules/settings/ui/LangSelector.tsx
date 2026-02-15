"use client";

import { updateLanguage } from "@/modules/settings/services/settings";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/ui/button";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Label } from "@/ui/label";

export function LangSelector() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<"en" | "es">(locale as "en" | "es");

  const handleClick = async () => {
    if (locale === selected) return;
    setLoading(true);

    try {
      await updateLanguage(selected);
      globalThis.location.reload();
    } catch (error) {
      console.error("Error updating language:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RadioGroup
        value={selected}
        orientation="horizontal"
        className="flex space-x-4"
        onValueChange={(value) => setSelected(value as "en" | "es")}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="en" id="en" />
          <Label htmlFor="en">{t("en")}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="es" id="es" />
          <Label htmlFor="es">{t("es")}</Label>
        </div>
      </RadioGroup>

      <Button
        loading={loading}
        type="submit"
        onClick={handleClick}
        disabled={locale === selected}
        className="mt-4 w-full"
      >
        {t("confirm")}
      </Button>
    </>
  );
}
