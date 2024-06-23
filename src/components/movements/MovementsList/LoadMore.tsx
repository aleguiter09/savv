"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function LoadMore({
  currentPage,
}: Readonly<{ currentPage: number }>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", `${currentPage + 1}`);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full flex justify-center">
      <button
        tabIndex={0}
        className="text-blue-500 font-semibold text-center mb-1 mt-3"
        onClick={handleClick}
      >
        Load more
      </button>
    </div>
  );
}
