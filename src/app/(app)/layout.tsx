import { adaptAccount } from "@/modules/accounts/adapters/account.adapter.";
import { getAccounts } from "@/modules/accounts/services/accounts";
import { adaptCategory } from "@/modules/categories/adapters/categories.adapter";
import { getCategories } from "@/modules/categories/services/categories";
import { DataProvider } from "@/modules/shared/stores/DataProvider";
import { Navbar } from "@/modules/shared/ui/Navbar/Navbar";
import { ToastManager } from "@/modules/shared/ui/Toast/toast-manager";

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
      <main className="mx-6 mt-4 pb-[calc(var(--navbar-height)+env(safe-area-inset-bottom,0px))] sm:mx-auto sm:w-lg lg:w-4xl">
        {children}
      </main>
      <Navbar />
      <ToastManager />
    </DataProvider>
  );
}
