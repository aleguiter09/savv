"use client";

import { categoryColorsLiterals } from "@/utils/constants";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <div className="grid gap-2 grid-cols-5">
        {categoryColorsLiterals.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`
              h-8 w-full rounded-lg transition-all duration-200
              border-2 shadow-sm hover:shadow-md cursor-pointer
              ${
                value === color
                  ? "scale-110 border-gray-800"
                  : "hover:scale-105"
              }
              bg-${color}-500
            `}
            title={color}
            aria-label={`Color ${color}`}
          />
        ))}
      </div>
    </div>
  );
}
