export default async function BalanceSkeleton() {
  return (
    <div className="grid grid-cols-3 text-center">
      <div>
        <div className="flex gap-2 items-center justify-center">
          <p className="font-semibold"></p>
        </div>
        <div className="flex w-full justify-center py-2">
          <output
            className="h-3 w-3 animate-spin rounded-full border-[2px] border-current border-t-transparent text-blue-600"
            aria-label="loading"
          />
        </div>
      </div>
      <div>
        <p className="font-semibold"></p>
        <div className=" flex w-full justify-center py-2">
          <output
            className="h-3 w-3 animate-spin rounded-full border-[2px] border-current border-t-transparent text-blue-600"
            aria-label="loading"
          />
        </div>
      </div>
      <div>
        <p className="font-semibold"></p>
        <div className="flex w-full justify-center py-2">
          <output
            className="h-3 w-3 animate-spin rounded-full border-[2px] border-current border-t-transparent text-blue-600"
            aria-label="loading"
          />
        </div>
      </div>
    </div>
  );
}
