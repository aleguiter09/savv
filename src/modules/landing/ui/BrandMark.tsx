type Props = Readonly<{
  className?: string;
}>;

/** Static Margo leaf + ascending bars mark for header/footer. */
export function BrandMark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Leaf */}
      <path
        d="M12 30C11.6 24.2 13.2 18.4 12.2 13.8C11.6 10.8 13.8 8.6 17.2 7.4C20.8 6.1 23.2 7.8 23.6 11.2C24.1 15.6 21.2 21.4 18.2 25.8C16.2 28.6 13.4 30 12 30Z"
        fill="#155DFC"
      />
      {/* Ascending bars */}
      <rect x="19" y="23" width="4.5" height="11" rx="2.25" fill="#155DFC" opacity="0.4" />
      <rect x="25" y="17" width="5" height="17" rx="2.5" fill="#155DFC" opacity="0.7" />
      <rect x="31.5" y="10" width="5.5" height="24" rx="2.75" fill="#155DFC" />
    </svg>
  );
}
