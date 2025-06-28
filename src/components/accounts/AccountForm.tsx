import { Account } from "@/types/database";
import { FormAccountState } from "@/types/general";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Card } from "../ui/card";

export const AccountForm = ({
  state,
  account,
}: {
  state: FormAccountState;
  account?: Account;
}) => {
  const t = useTranslations("accounts");
  const { errors } = state;
  const { pending } = useFormStatus();

  return (
    <Card className="rounded-md p-4 flex flex-col gap-2">
      {/* Account name */}
      <Input
        id="name"
        name="name"
        placeholder={t("enterAccountName")}
        label={t("enterName")}
        error={errors?.name?.[0] && t(errors.name[0])}
        defaultValue={account?.name}
      />

      {/* Account balance */}
      <Input
        id="balance"
        type="number"
        name="balance"
        placeholder={t("enterBalance")}
        step="0.01"
        label={t("currentBalance")}
        error={errors?.balance?.[0] && t(errors.balance[0])}
        defaultValue={account?.balance}
      />

      {/* Default account */}
      <div className="flex items-center gap-3 my-2">
        <label htmlFor="default" className="text-sm font-medium">
          {t("defaultAccount")}
        </label>
        <Checkbox
          id="default"
          name="default"
          defaultChecked={account?.default}
        />
      </div>

      {pending ? (
        <div className="flex w-full justify-center rounded-md bg-blue-600 py-2">
          <output
            className="h-5 w-5 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
            aria-live="polite"
          />
        </div>
      ) : (
        <button
          className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white focus:outline-none focus:ring focus:ring-gray-blue"
          type="submit"
        >
          {account ? t("editAccount") : t("createAccount")}
        </button>
      )}
    </Card>
  );
};
