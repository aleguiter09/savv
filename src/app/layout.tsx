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
      <body className={inter.className}>
        <SupabaseProvider>
          <AuthProvider serverSession={session}>
            {session && <Navbar />}
            {children}
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
