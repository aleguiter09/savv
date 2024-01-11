import "server-only";
import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "@/context/authContext";
import SupabaseProvider from "@/context/supabaseContext";
import { createClient } from "@/utils/supabase-server";
import Navbar from "@/components/Navbar/Navbar";
export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Finance tracker",
  description: "Web application where you can track your finances",
  // viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
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
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className={`pt-4 pb-12 ${inter.className} antialiased`}>
        <SupabaseProvider>
          <AuthProvider serverSession={session}>
            <main className="mx-5 sm:w-[32rem] sm:mx-auto">{children}</main>
            {session && <Navbar />}
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
