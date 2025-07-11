import { CategoryIconsKeys } from "@/types/general";
import { CATEGORY_ICONS } from "@/utils/constants";

type Props = Readonly<{
  icon: string;
  color: string;
  size?: string;
  padding?: string;
}>;

export function CategoryIcon({
  icon,
  color,
  size = "14px",
  padding = "p-[3px]",
}: Props) {
  const Icon = CATEGORY_ICONS[icon as CategoryIconsKeys];

  return (
    <div className={`bg-${color} rounded-full ${padding}`}>
      <Icon className="text-white" size={size} />
    </div>
  );
}
