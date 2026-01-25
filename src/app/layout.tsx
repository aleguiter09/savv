import "server-only";
import "./globals.css";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/Navbar/Navbar";

export const dynamic = "force-dynamic";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Savv Finances",
  description:
    "Savv allows users to record & categorize their transactions and monitor their accounts to facilitate money management. Take control and start saving today!",
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/apple-touch-icon.png"],
  },
  manifest: "/manifest.json",
  metadataBase: new URL("https://savv-finances.vercel.app/"),
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: "no",
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();

  const [user, locale] = await Promise.all([
    supabase.auth.getUser(),
    getLocale(),
  ]);

  return (
    <html lang={locale} className="scroll-smooth">
      <body
        className={`mt-4 pb-12 ${inter.className} antialiased bg-gray-100 text-gray-900`}
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
        <main className="mx-6 sm:w-lg sm:mx-auto">
          <NextIntlClientProvider locale={locale}>
            {children}
          </NextIntlClientProvider>
        </main>
        {!!user.data.user?.id && <Navbar />}
        <SpeedInsights />
      </body>
    </html>
  );
}
