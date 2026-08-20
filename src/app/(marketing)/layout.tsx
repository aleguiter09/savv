import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-landing-display",
  display: "swap",
});

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${plusJakarta.variable} -mt-4 -mb-12 min-h-screen bg-gray-50 text-gray-900`}
    >
      {children}
    </div>
  );
}
