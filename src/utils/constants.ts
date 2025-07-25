import { CategoryIcons } from "@/types/general";
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

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const tailwindColors = [
  "bg-amber-500",
  "bg-blue-500",
  "bg-cyan-500",
  "bg-fuchsia-500",
  "bg-gray-500",
  "bg-green-500",
  "bg-indigo-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-red-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-teal-500",
  "bg-violet-500",
  "bg-yellow-500",
  "border-amber-500",
  "border-blue-500",
  "border-cyan-500",
  "border-fuchsia-500",
  "border-gray-500",
  "border-green-500",
  "border-indigo-500",
  "border-orange-500",
  "border-pink-500",
  "border-red-500",
  "border-rose-500",
  "border-sky-500",
  "border-teal-500",
  "border-violet-500",
  "border-yellow-500",
];
