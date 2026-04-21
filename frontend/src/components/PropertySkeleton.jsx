export default function PropertySkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_20px_70px_-30px_rgba(15,23,42,0.25)]">
      <div className="h-64 animate-pulse bg-slate-200" />
      <div className="space-y-4 p-5">
        <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200" />
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-200" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
