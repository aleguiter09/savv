"use client";

import { updateLanguage } from "@/services/settings";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Input } from "../ui/input";

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
      <div className="flex gap-20">
        <div className="flex items-center gap-2">
          <Input
            className="w-4 h-4 border-gray-300 focus:ring-blue-500 "
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
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
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
      {loading ? (
        <div className="mt-4 flex w-full justify-center rounded-md bg-blue-600 py-2">
          <output
            className="h-5 w-5 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
            aria-live="polite"
          />
        </div>
      ) : (
        <button
          tabIndex={0}
          onClick={handleClick}
          disabled={locale === selected}
          className="mt-4 w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white focus:outline-none focus:ring focus:ring-gray-blue disabled:bg-gray-400 disabled:cursor-not-allowed"
          type="submit"
        >
          {t("confirm")}
        </button>
      )}
    </>
  );
}
