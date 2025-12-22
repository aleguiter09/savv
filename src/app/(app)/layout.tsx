import { getAccounts } from "@/services/accounts";
import { getCategories } from "@/services/categories";
import { DataProvider } from "@/stores/DataProvider";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [accounts, categories] = await Promise.all([
    getAccounts(),
    getCategories(),
  ]);

  return (
    <DataProvider accounts={accounts} categories={categories}>
      {children}
    </DataProvider>
  );
}
