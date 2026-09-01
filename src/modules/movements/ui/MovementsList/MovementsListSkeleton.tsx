import { Card } from "@/ui/card";

export function MovementsListSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      {[0, 1].map((group) => (
        <Card
          key={group}
          className="mb-4 px-3 py-2 border-b-4 border-b-blue-600"
        >
          <div className="flex items-center justify-between px-2 pb-2 pt-1">
            <span className="h-3 w-24 rounded bg-slate-300" />
            <span className="h-3 w-16 rounded bg-slate-300" />
          </div>
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                className="flex items-center justify-between px-1 py-2 border-b border-gray-200 last:border-0"
              >
                <div className="flex gap-3">
                  <span className="size-9 rounded-full bg-slate-300" />
                  <div className="flex flex-col gap-1">
                    <span className="h-3 w-28 rounded bg-slate-300" />
                    <span className="h-3 w-16 rounded bg-slate-300" />
                  </div>
                </div>
                <span className="h-4 w-16 rounded bg-slate-300" />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
