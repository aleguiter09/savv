import "server-only";
import "./globals.css";
import { Inter } from "next/font/google";
import { createClient } from "@/utils/supabase-server";
import Navbar from "@/components/Navbar/Navbar";
import NextTopLoader from "nextjs-toploader";
export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Finance tracker",
  description: "Web application where you can track your finances",
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/apple-touch-icon.png"],
  },
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
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
        <main className="mx-6 sm:w-[32rem] sm:mx-auto">{children}</main>
        {user && <Navbar />}
      </body>
    </html>
  );
}
