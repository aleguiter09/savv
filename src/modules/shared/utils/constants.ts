import {
  BusFront,
  CirclePercent,
  Clapperboard,
  Coins,
  Dumbbell,
  File,
  FileText,
  Forward,
  Hamburger,
  HandCoins,
  Hospital,
  House,
  Laptop,
  Martini,
  MessageCircleQuestion,
  PawPrint,
  PiggyBank,
  PlaneTakeoff,
  ReceiptText,
  School,
  Shirt,
  ShoppingCart,
  Smartphone,
  TvMinimal,
  Wallet,
} from "lucide-react";
import { CategoryIcons } from "../types/global.types";

export const CATEGORY_ICONS: CategoryIcons = {
  food: Hamburger,
  commissions: ReceiptText,
  services: File,
  education: School,
  technology: Laptop,
  entertainment: Clapperboard,
  home: House,
  taxes: FileText,
  clothing: Shirt,
  pets: PawPrint,
  other: MessageCircleQuestion,
  loans: HandCoins,
  healthcare: Hospital,
  party: Martini,
  market: ShoppingCart,
  subscription: TvMinimal,
  transport: BusFront,
  travels: PlaneTakeoff,
  telephone: Smartphone,
  salary: Wallet,
  awards: Coins,
  investments: PiggyBank,
  sales: CirclePercent,
  transfer: Forward,
  sports: Dumbbell,
} as const;

export const categoryColorsLiterals = [
  "amber",
  "blue",
  "cyan",
  "fuchsia",
  "gray",
  "green",
  "indigo",
  "orange",
  "pink",
  "red",
  "rose",
  "sky",
  "teal",
  "violet",
  "yellow",
] as const;

type CategoryColor = (typeof categoryColorsLiterals)[number];

export const categoryBgClass: Record<CategoryColor, string> = {
  amber: "bg-amber-500",
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  fuchsia: "bg-fuchsia-500",
  gray: "bg-gray-500",
  green: "bg-green-500",
  indigo: "bg-indigo-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  red: "bg-red-500",
  rose: "bg-rose-500",
  sky: "bg-sky-500",
  teal: "bg-teal-500",
  violet: "bg-violet-500",
  yellow: "bg-yellow-500",
};

export const categoryBorderClass: Record<CategoryColor, string> = {
  amber: "border-amber-500",
  blue: "border-blue-500",
  cyan: "border-cyan-500",
  fuchsia: "border-fuchsia-500",
  gray: "border-gray-500",
  green: "border-green-500",
  indigo: "border-indigo-500",
  orange: "border-orange-500",
  pink: "border-pink-500",
  red: "border-red-500",
  rose: "border-rose-500",
  sky: "border-sky-500",
  teal: "border-teal-500",
  violet: "border-violet-500",
  yellow: "border-yellow-500",
};

export const categoryRingClass: Record<CategoryColor, string> = {
  amber: "ring-amber-500",
  blue: "ring-blue-500",
  cyan: "ring-cyan-500",
  fuchsia: "ring-fuchsia-500",
  gray: "ring-gray-500",
  green: "ring-green-500",
  indigo: "ring-indigo-500",
  orange: "ring-orange-500",
  pink: "ring-pink-500",
  red: "ring-red-500",
  rose: "ring-rose-500",
  sky: "ring-sky-500",
  teal: "ring-teal-500",
  violet: "ring-violet-500",
  yellow: "ring-yellow-500",
};

export function getCategoryBgClass(color: string): string {
  return categoryBgClass[color as CategoryColor] ?? categoryBgClass.gray;
}

export function getCategoryBorderClass(color: string): string {
  return categoryBorderClass[color as CategoryColor] ?? categoryBorderClass.gray;
}

export function getCategoryRingClass(color: string): string {
  return categoryRingClass[color as CategoryColor] ?? categoryRingClass.gray;
}
