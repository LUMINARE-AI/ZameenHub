export default function PropertySkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="h-32 animate-pulse bg-slate-200 sm:h-36 xl:h-32" />
      <div className="space-y-3 p-3">
        <div className="h-5 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-200" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
