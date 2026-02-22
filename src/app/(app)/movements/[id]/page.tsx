import { MovementDetailPage } from "@/modules/movements/pages/MovementDetailsPage";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageProps) {
  return <MovementDetailPage id={Number(params.id)} />;
}
