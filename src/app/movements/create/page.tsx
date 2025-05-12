import Icon from "@/components/common/Icon";
import AddMovementForm from "@/components/movements/AddMovement/AddMovementForm";
import Link from "next/link";

export default async function AddMovementPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/">
          <Icon color="stone" icon="arrow-left" />
        </Link>
        <h4 className="font-medium">Add Movement</h4>
        <span></span>
      </div>
      <AddMovementForm />
    </>
  );
}
