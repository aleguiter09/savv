"use client";

import { CATEGORY_ICONS } from "@/modules/shared/utils/constants";
import { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CategoryColors } from "../../types/global.types";

interface IconPickerProps {
  value?: string;
  color?: CategoryColors;
  onChange: (icon: string) => void;
}

const colorVariants = {
  amber: "bg-amber-500 ring-amber-500",
  blue: "bg-blue-500 ring-blue-500",
  cyan: "bg-cyan-500 ring-cyan-500",
  fuchsia: "bg-fuchsia-500 ring-fuchsia-500",
  gray: "bg-gray-500 ring-gray-500",
  green: "bg-green-500 ring-green-500",
  indigo: "bg-indigo-500 ring-indigo-500",
  orange: "bg-orange-500 ring-orange-500",
  pink: "bg-pink-500 ring-pink-500",
  red: "bg-red-500 ring-red-500",
  rose: "bg-rose-500 ring-rose-500",
  sky: "bg-sky-500 ring-sky-500",
  teal: "bg-teal-500 ring-teal-500",
  violet: "bg-violet-500 ring-violet-500",
  yellow: "bg-yellow-500 ring-yellow-500",
} as const;

export function IconPicker({
  value,
  color = "gray",
  onChange,
}: IconPickerProps) {
  const t = useTranslations("common");
  const iconEntries = Object.entries(CATEGORY_ICONS) as [string, LucideIcon][];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3 ">
        {iconEntries.map(([iconKey, IconComponent]) => (
          <button
            key={iconKey}
            type="button"
            onClick={() => onChange(iconKey)}
            className={`
              rounded-full p-2.5 transition-all duration-200 hover:scale-110 cursor-pointer ${colorVariants[color as keyof typeof colorVariants]}
              ${value === iconKey ? `scale-110 ring-offset-2 ring-2` : ""}
            `}
            title={iconKey}
            aria-label={t("iconLabel", { name: iconKey })}
          >
            <IconComponent className="text-white" size={20} />
          </button>
        ))}
      </div>
    </div>
  );
}
