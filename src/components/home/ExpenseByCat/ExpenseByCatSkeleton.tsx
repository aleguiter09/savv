export default function ExpenseByCatSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pb-1">
      <div className={`h-8 w-40 rounded-md py-2 bg-slate-300 animate-pulse`} />
      <div className={`h-8 w-40 rounded-md py-2 bg-slate-300 animate-pulse`} />
      <div className={`h-8 w-40 rounded-md py-2 bg-slate-300 animate-pulse`} />
      <div className={`h-8 w-40 rounded-md py-2 bg-slate-300 animate-pulse`} />
      <div className={`h-8 w-40 rounded-md py-2 bg-slate-300 animate-pulse`} />
      <div className={`h-8 w-40 rounded-md py-2 bg-slate-300 animate-pulse`} />
    </div>
  );
}
