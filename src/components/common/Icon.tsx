"use client";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/outline";
import { Icon as TremorIcon } from "@tremor/react";

const icons = {
  "arrow-left": ArrowLeftIcon,
  "arrow-right": ArrowRightIcon,
};

type TremorSizes = "xs" | "sm" | "md" | "lg" | "xl";
type IconType = "arrow-left" | "arrow-right";
type TremorColors =
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

export default function Icon({
  color,
  size,
  icon,
}: Readonly<{ color?: TremorColors; size?: TremorSizes; icon: IconType }>) {
  return <TremorIcon color={color} size={size} icon={icons[icon]} />;
}
