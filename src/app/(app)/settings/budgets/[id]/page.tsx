import { EditBudgetPage } from "@/modules/budgets/pages/EditBudgetPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <EditBudgetPage id={Number(id)} />;
}
