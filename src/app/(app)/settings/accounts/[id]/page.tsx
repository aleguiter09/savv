import { EditAccountPage } from "@/modules/accounts/pages/EditAccountPage";

type EditAccountPageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Readonly<EditAccountPageProps>) {
  const { id } = await params;
  return <EditAccountPage id={Number(id)} />;
}
