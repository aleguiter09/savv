import { adaptAccount } from "@/modules/accounts/adapters/account.adapter.";
import { getAccounts } from "@/modules/accounts/services/accounts";
import { adaptCategory } from "@/modules/categories/adapters/categories.adapter";
import { getCategories } from "@/modules/categories/services/categories";
import { DataProvider } from "@/modules/shared/stores/DataProvider";
import { Navbar } from "@/modules/shared/ui/Navbar/Navbar";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [accounts, categories] = await Promise.all([
    getAccounts(),
    getCategories(),
  ]);

  const adaptedAccounts = accounts.map(adaptAccount);
  const adaptedCategories = categories.map(adaptCategory);

  return (
    <DataProvider accounts={adaptedAccounts} categories={adaptedCategories}>
      {children}
      <Navbar />
    </DataProvider>
  );
}
