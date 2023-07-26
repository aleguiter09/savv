import "server-only";
import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "@/context/authContext";
import SupabaseProvider from "@/context/supabaseContext";
import { createClient } from "@/utils/supabase-server";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My finances",
  description: "Small project to track finances",
};

export default async function RootLayout({ children }) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <AuthProvider serverSession={session}>{children}</AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
