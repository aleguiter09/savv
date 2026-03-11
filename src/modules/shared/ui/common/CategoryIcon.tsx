import { CATEGORY_ICONS } from "@/modules/shared/utils/constants";
import { LucideProps } from "lucide-react";

interface CategoryIconProps extends LucideProps {
  icon: string;
}

export function CategoryIcon({ icon, ...props }: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[icon];

  if (!Icon ) return <div className="w-5 h-5 rounded-full bg-gray-500" />;

  return <Icon className="text-white" {...props} />;
}
