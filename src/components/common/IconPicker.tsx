"use client";

import { CATEGORY_ICONS } from "@/utils/constants";
import { LucideIcon } from "lucide-react";

interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const iconEntries = Object.entries(CATEGORY_ICONS) as [string, LucideIcon][];

  return (
    <div className="space-y-2">
      <div className="grid gap-2 grid-cols-5">
        {iconEntries.map(([iconKey, IconComponent]) => (
          <button
            key={iconKey}
            type="button"
            onClick={() => onChange(iconKey)}
            className={`
              h-8 w-full rounded-lg transition-all duration-200
              border-2 shadow-sm hover:shadow-md cursor-pointer
              flex items-center justify-center
              ${
                value === iconKey
                  ? "scale-110 border-gray-800 bg-gray-100"
                  : "border-gray-200 hover:scale-105 bg-white "
              }
            `}
            title={iconKey}
            aria-label={`Icon ${iconKey}`}
          >
            <IconComponent className="h-5 w-5 text-gray-700" />
          </button>
        ))}
      </div>
    </div>
  );
}
