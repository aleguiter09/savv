import { Card, List } from "@tremor/react";

export default function FinancesSkeleton() {
  return (
    <Card className="mb-4 animate-pulse px-3 py-2">
      {/* <div className="flex justify-between">
      <div className="flex flex-col">
          <p className="mb-1 text-sm font-semibold text-slate-500">Incomes</p>
          <div className="h-6 w-24 rounded bg-slate-300" />
        </div>
        <div className="flex flex-col text-right">
          <p className="mb-1 text-sm font-semibold text-slate-500">Expenses</p>
          <div className="h-6 w-24 rounded bg-slate-300" />
        </div>
      </div>
      <ProgressBar value={0} color="blue" className="mb-2 mt-3" />*/}
      <List>
        <div className="">
          <div className="flex justify-between">
            <div className="my-2 ms-1.5 h-3 w-24 rounded bg-slate-300" />
            <div className="my-2 me-2 h-4 w-8 rounded-full bg-slate-300" />
          </div>
          <div className="flex justify-between align-middle">
            <div className="ms-1.5 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-slate-300" />
              <div className="h-3 w-36 rounded bg-slate-300" />
            </div>
            <div className="my-2 me-2 h-3 w-16 rounded-full bg-slate-300" />
          </div>

          <div className="mt-2 flex justify-between align-middle">
            <div className="ms-1.5 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-slate-300" />
              <div className="h-3 w-36 rounded bg-slate-300" />
            </div>
            <div className="my-2 me-2 h-3 w-16 rounded-full bg-slate-300" />
          </div>

          <div className="mt-2 flex justify-between align-middle">
            <div className="ms-1.5 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-slate-300" />
              <div className="h-3 w-36 rounded bg-slate-300" />
            </div>
            <div className="my-2 me-2 h-3 w-16 rounded-full bg-slate-300" />
          </div>
        </div>
      </List>
    </Card>
  );
}
