import { EditMovementPage } from "@/modules/movements/pages/EditMovementPage";

type EditMovementPageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: EditMovementPageProps) {
  const { id } = await params;
  return <EditMovementPage id={Number(id)} />;
}
