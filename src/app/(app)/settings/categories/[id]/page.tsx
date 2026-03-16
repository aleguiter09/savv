import EditCategoryPage from "@/modules/categories/pages/EditCategoryPage";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: EditCategoryPageProps) {
  const { id } = await params;
  return <EditCategoryPage id={Number(id)} />;
}
