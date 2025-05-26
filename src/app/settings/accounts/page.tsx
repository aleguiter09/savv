import AddButton from "@/components/home/ActionBar/AddButton";
import { getAccounts } from "@/services/accounts";
import { mdiCreditCardEditOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function AccountsPage() {
  const t = await getTranslations("settings");
  const accounts = await getAccounts();

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-semibold">
          {t("title")} / {t("accounts")}
        </h3>
        <AddButton href="/settings/accounts/create" />
      </div>
      <ul className="text-sm flex flex-col gap-2">
        {accounts.map((account) => (
          <li key={account.id}>
            <Link
              href={`/settings/accounts/${account.id}`}
              tabIndex={0}
              className="w-full px-4 py-2 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:text-blue-500 rounded-lg flex justify-between"
            >
              <p>{account.name}</p>
              <div className="flex gap-3">
                <Icon path={mdiCreditCardEditOutline} size="23px" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
