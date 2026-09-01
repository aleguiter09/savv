import { CATEGORY_ICONS, getCategoryBgClass } from "@/modules/shared/utils/constants";
import { LucideProps } from "lucide-react";

interface CategoryIconProps extends LucideProps {
  icon: string;
  color: string;
}

export function CategoryIcon({ icon, color, ...props }: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[icon];

  return (
    <div className={`text-white rounded-full p-1.5 ${getCategoryBgClass(color)}`}>
      <Icon size={18} {...props} />
    </div>
  );
}
