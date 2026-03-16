import { MovementDetailPage } from "@/modules/movements/pages/MovementDetailsPage";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <MovementDetailPage id={Number(id)} />;
}
