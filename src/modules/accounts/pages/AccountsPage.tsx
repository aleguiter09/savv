import { getAccounts } from "@/modules/accounts/services/accounts";
import { adaptAccount } from "@/modules/accounts/adapters/account.adapter.";
import { AccountDialog } from "@/modules/accounts/ui/AccountDialog";
import { AccountsList } from "@/modules/accounts/ui/AccountsList";
import { FloatingAddButton } from "@/modules/dashboard/ui/ActionBar/FloatingAddButton";
import { getTranslations } from "next-intl/server";

export async function AccountsPage() {
  const t = await getTranslations("settings");
  const accounts = (await getAccounts()).map(adaptAccount);

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-1 text-sm">
          <h3>{t("title")}</h3>
          <span className="text-gray-500">/</span>
          <h3 className="font-semibold">{t("accounts")}</h3>
        </div>
        <AccountDialog trigger={<FloatingAddButton />} />
      </div>
      <AccountsList accounts={accounts} />
    </>
  );
}
