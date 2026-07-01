export default function PropertySkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-[4/3] animate-shimmer" />
      <div className="space-y-2 p-3">
        <div className="h-5 w-28 animate-shimmer rounded-full" />
        <div className="h-4 w-3/4 animate-shimmer rounded-full" />
        <div className="h-3 w-1/2 animate-shimmer rounded-full" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 animate-shimmer rounded-lg" />
          <div className="h-10 animate-shimmer rounded-lg" />
        </div>
      </div>
    </div>
  );
}
