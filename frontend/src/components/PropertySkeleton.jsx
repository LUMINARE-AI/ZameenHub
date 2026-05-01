export default function PropertySkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="h-28 animate-pulse bg-slate-200 sm:h-[120px] xl:h-28" />
      <div className="space-y-2 p-2.5">
        <div className="h-5 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-200" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-9 animate-pulse rounded-md bg-slate-100" />
          <div className="h-9 animate-pulse rounded-md bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
