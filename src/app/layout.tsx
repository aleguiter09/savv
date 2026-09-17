import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata = {
  title: "Savv Finances",
  description:
    "Controlá tus cuentas, registrá ingresos y gastos, entendé en qué gastás y seguí la evolución de tu patrimonio — todo en un solo lugar.",
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/apple-touch-icon.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Savv",
  },
  metadataBase: new URL("https://savv-finances.vercel.app/"),
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: "no",
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`scroll-smooth ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="font-sans antialiased bg-surface text-foreground">
        <NextTopLoader
          color="#155DFC"
          initialPosition={0.1}
          crawlSpeed={200}
          height={5}
          easing="ease"
          speed={200}
          showSpinner={false}
        />
        <NextIntlClientProvider locale={locale}>
          {children}
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
