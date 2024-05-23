import CreateAccountForm from "@/components/accounts/CreateAccountForm";
import Icon from "@/components/common/Icon";
import Link from "next/link";

export default function CreateAccountPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/settings/accounts">
          <Icon color="stone" icon={"arrow-left"} />
        </Link>
        <h4 className="font-medium">Create Account</h4>
        <span></span>
      </div>
      <CreateAccountForm />
    </>
  );
}
