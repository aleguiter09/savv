import { List } from "@tremor/react";

export default function FinancesSkeleton() {
  return (
    <List>
      <div className="animate-pulse">
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
  );
}
