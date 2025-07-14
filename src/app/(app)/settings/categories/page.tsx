import { CategoryIcon } from "@/components/common/CategoryIcon";
import { getCategories } from "@/services/categories";

export default async function CategoriesPage() {
  const categories = await getCategories();

  const parentCategories = categories.filter(
    (category) => category.parent_id === null
  );

  const mappedCategories = parentCategories.map((category) => {
    const children = categories.filter(
      (child) => child.parent_id === category.id
    );

    return {
      ...category,
      children,
    };
  });

  return (
    <div>
      {mappedCategories.map((category) => (
        <div key={category.id} className="mb-4">
          <h3 className="font-semibold mb-2">
            {category.title.toLocaleUpperCase()}
          </h3>
          <ul className="flex flex-col gap-2">
            {category.children.map((child) => (
              <li key={child.id} className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <CategoryIcon
                    icon={child.icon ?? "transfer"}
                    color={child.color ?? "gray"}
                  />
                </div>
                <p className="text-sm">{child.title.toLocaleLowerCase()}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
