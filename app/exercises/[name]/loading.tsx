import { Skeleton } from "@/shared/ui/Skeleton";

export default function Loading() {
  return (
    <div className="pt-2">
      <Skeleton className="mb-2 h-8 w-20 rounded-lg" />
      <div className="mb-4 flex items-center gap-3">
        <Skeleton className="h-14 w-14 rounded-full" />
        <Skeleton className="h-6 w-40" />
      </div>

      <div className="mb-5 flex gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>

      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="mb-3 h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}
