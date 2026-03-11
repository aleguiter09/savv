import { CATEGORY_ICONS } from "@/modules/shared/utils/constants";
import { LucideProps } from "lucide-react";

interface CategoryIconProps extends LucideProps {
  icon: string;
}

export function CategoryIcon({ icon, color, ...props }: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[icon];

  return <Icon className={`text-white rounded-full p-1 bg-${color}-500`} size={32} {...props} />;
}
