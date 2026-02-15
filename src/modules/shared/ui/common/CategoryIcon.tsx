import { CATEGORY_ICONS } from "@/modules/shared/utils/constants";

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
  const Icon = CATEGORY_ICONS[icon];

  return (
    <div className={`bg-${color}-500 rounded-full ${padding}`}>
      <Icon className="text-white" size={size} />
    </div>
  );
}
