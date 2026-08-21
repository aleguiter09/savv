import { getAccounts } from "@/modules/accounts/services/accounts";
import { adaptAccount } from "@/modules/accounts/adapters/account.adapter.";
import { AccountsList } from "@/modules/accounts/ui/AccountsList";
import { getTranslations } from "next-intl/server";

export async function AccountsPage() {
  const t = await getTranslations("settings");
  const accounts = (await getAccounts()).map(adaptAccount);

  return (
    <>
      <div className="mb-4 flex items-center gap-1 text-sm">
        <h3>{t("title")}</h3>
        <span className="text-gray-500">/</span>
        <h3 className="font-semibold">{t("accounts")}</h3>
      </div>
      <AccountsList accounts={accounts} />
    </>
  );
}
