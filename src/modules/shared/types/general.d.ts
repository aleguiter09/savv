export type YearMonth = { year: number; month: number };

export type CategoryIcons = {
  [key: string]: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export type ServerActionResponse = {
  success: boolean;
  error?: string;
};
