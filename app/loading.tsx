import { Skeleton } from "@/shared/ui/Skeleton";

export default function Loading() {
  return (
    <div className="pt-2">
      <div className="flex items-baseline justify-between pt-6.5 pb-4.5">
        <Skeleton className="h-6.5 w-24" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>

      <div className="lg:grid lg:grid-cols-[360px_1fr] lg:items-start lg:gap-6 xl:grid-cols-[380px_1fr]">
        <div>
          <Skeleton className="h-16 w-full rounded-card" />
          <div className="mt-2 grid grid-cols-2 gap-3">
            <Skeleton className="h-24 rounded-card" />
            <Skeleton className="h-24 rounded-card" />
          </div>
        </div>

        <div>
          <div className="mt-6 mb-3 flex items-center justify-between lg:mt-0">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-16" />
          </div>
          <Skeleton className="mb-3 h-13.5 w-full rounded-card" />
          <div className="lg:grid lg:grid-cols-2 lg:gap-3">
            <Skeleton className="mb-3 h-20 rounded-card" />
            <Skeleton className="mb-3 h-20 rounded-card" />
          </div>
        </div>
      </div>
    </div>
  );
}
