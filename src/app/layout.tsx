import "server-only";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";
import NextTopLoader from "nextjs-toploader";
export const dynamic = "force-dynamic";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DataProvider } from "@/providers/DataProvider";
import { getAccounts } from "@/services/accounts";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Savv Finances",
  description:
    "Savv allows users to record & categorize their transactions and monitor their accounts to facilitate money management. Take control and start saving today!",
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/apple-touch-icon.png"],
  },
  metadataBase: new URL("https://savv-finances.vercel.app/"),
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: "no",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const accounts = await getAccounts();

  return (
    <html lang="en">
      <body
        className={`pt-4 pb-12 ${inter.className} antialiased bg-gray-100 text-gray-900`}
      >
        <NextTopLoader
          color="#3B82F6"
          initialPosition={0.1}
          crawlSpeed={200}
          height={5}
          easing="ease"
          speed={200}
          showSpinner={false}
        />
        <main className="mx-6 sm:w-[32rem] sm:mx-auto">
          <DataProvider accounts={accounts}>{children}</DataProvider>
        </main>
        <Navbar />
        <SpeedInsights />
      </body>
    </html>
  );
}
