import { Skeleton } from "@/shared/ui/Skeleton";

export default function Loading() {
  return (
    <div className="pt-2">
      <Skeleton className="mb-2 h-8 w-24 rounded-lg" />
      <Skeleton className="mb-4 h-6 w-40" />
      <Skeleton className="mb-5 h-13.5 w-full rounded-2xl" />
      <Skeleton className="mb-6 h-32 w-full rounded-card" />

      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>

      {[0, 1, 2].map((i) => (
        <div key={i} className="mb-6">
          <div className="mb-2 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-16 w-full rounded-card" />
        </div>
      ))}
    </div>
  );
}
