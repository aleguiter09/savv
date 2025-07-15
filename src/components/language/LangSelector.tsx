"use client";

import { updateLanguage } from "@/services/settings";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function LangSelector() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(locale);

  const handleClick = async () => {
    if (locale === selected) return;
    setLoading(true);

    try {
      await updateLanguage(selected as "en" | "es");
      window.location.reload();
    } catch (error) {
      console.error("Error updating language:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-20 ">
        <div className="flex items-center gap-2">
          <Input
            className="w-4 h-4 px-0 py-0 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
            id="en"
            type="radio"
            value="en"
            name="en"
            checked={selected === "en"}
            label={t("en")}
            onChange={(e) => {
              setSelected(e.target.value);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            className="w-4 h-4 px-0 py-0 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            id="es"
            checked={selected === "es"}
            type="radio"
            value="es"
            name="es"
            label={t("es")}
            onChange={(e) => {
              setSelected(e.target.value);
            }}
          />
        </div>
      </div>

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
