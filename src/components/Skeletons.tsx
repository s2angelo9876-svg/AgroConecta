export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-stone-200/70 ${className}`}
      aria-hidden
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl border border-cream-200 bg-white p-3 shadow-sm">
      <Skeleton className="h-32 w-28 shrink-0 rounded-xl sm:w-36" />
      <div className="flex flex-1 flex-col gap-2 py-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
    </div>
  );
}

export function FarmerHeaderSkeleton() {
  return (
    <div className="rounded-3xl border border-cream-200 bg-white shadow-sm">
      <Skeleton className="h-44 sm:h-56 rounded-t-3xl rounded-b-none" />
      <div className="space-y-3 px-6 py-4">
        <div className="flex items-end gap-4">
          <Skeleton className="-mt-12 h-24 w-24 rounded-full" />
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="rounded-3xl border border-cream-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function FaqsSkeleton() {
  return (
    <div className="mt-8 space-y-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-2xl" />
      ))}
    </div>
  );
}