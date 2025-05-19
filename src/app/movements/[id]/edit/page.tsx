import Icon from "@/components/common/Icon";
import EditMovementForm from "@/components/movements/EditMovement/EditMovementForm";
import { getMovementById } from "@/services/movements";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditMovementPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const id = params.id;
  const movement = await getMovementById(Number(id));

  if (!movement) {
    notFound();
  }

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href={`/movements/${id}`}>
          <Icon color="stone" icon="arrow-left" />
        </Link>
        <h4 className="font-medium">Edit Movement</h4>
        <span></span>
      </div>
      <EditMovementForm movement={movement} />
    </>
  );
}
