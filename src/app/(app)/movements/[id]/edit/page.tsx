import { EditMovementPage } from "@/modules/movements/pages/EditMovementPage";

type EditMovementPageProps = {
  params: { id: string };
};

export default async function Page({ params }: EditMovementPageProps) {
  return <EditMovementPage id={Number(params.id)} />;
}
