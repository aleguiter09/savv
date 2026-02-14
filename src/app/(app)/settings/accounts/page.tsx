import { getAccounts } from "@/modules/accounts/services/accounts";
import { AddButton } from "@/modules/dashboard/ui/ActionBar/AddButton";
import { ToastManager } from "@/modules/shared/ui/Toast/toast-manager";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function AccountsPage() {
  const t = await getTranslations("settings");
  const accounts = await getAccounts();

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-1 text-sm">
          <h3>{t("title")}</h3>
          <span className="text-gray-500">/</span>
          <h3 className="font-semibold">{t("accounts")}</h3>
        </div>
        <AddButton href="/settings/accounts/create" />
      </div>
      <ul className="text-sm flex flex-col gap-2">
        {accounts.map((account) => (
          <li key={account.id}>
            <Link
              href={`/settings/accounts/${account.id}`}
              tabIndex={0}
              className="w-full px-4 py-2 border border-gray-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:text-blue-500 rounded-lg flex justify-between"
            >
              <p>{account.name}</p>
            </Link>
          </li>
        ))}
      </ul>

      <ToastManager />
    </>
  );
}
