import EditCategoryPage from "@/modules/categories/pages/EditCategoryPage";

type EditCategoryPageProps = {
  params: { id: string };
};

export default async function Page({ params }: EditCategoryPageProps) {
  return <EditCategoryPage id={Number(params.id)} />;
}
