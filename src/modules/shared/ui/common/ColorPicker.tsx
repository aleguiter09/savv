"use client";

import { categoryColorsLiterals } from "@/modules/shared/utils/constants";

import { useTranslations } from "next-intl";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const t = useTranslations("common");
  return (
    <div className="space-y-2">
      <div
        className="flex overflow-x-auto gap-2 py-2 snap-x snap-mandatory 
        [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categoryColorsLiterals.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`
              shrink-0 size-10 rounded-full transition-all duration-200
              border cursor-pointer snap-center
              ${value === color ? "ring-2 ring-offset-2" : ""}
              bg-${color}-500 ring-${color}-500
            `}
            title={color}
            aria-label={t("colorLabel", { name: t(`colors.${color}`) })}
          />
        ))}
      </div>
    </div>
  );
}
