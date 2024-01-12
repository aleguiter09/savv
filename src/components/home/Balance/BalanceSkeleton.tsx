export default function BalanceSkeleton() {
  return (
    <div className="grid grid-cols-3 text-center">
      <div>
        <div className="flex gap-2 items-center justify-center">
          <p className="font-semibold">Balance</p>
        </div>
        <div className="flex w-full justify-center py-2">
          <output
            className="h-3 w-3 animate-spin rounded-full border-[2px] border-current border-t-transparent text-blue-600"
            aria-label="loading"
          />
        </div>
      </div>
      <div>
        <p className="font-semibold">Incomes</p>
        <div className=" flex w-full justify-center py-2">
          <output
            className="h-3 w-3 animate-spin rounded-full border-[2px] border-current border-t-transparent text-blue-600"
            aria-label="loading"
          />
        </div>
      </div>
      <div>
        <p className="font-semibold">Expenses</p>
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
