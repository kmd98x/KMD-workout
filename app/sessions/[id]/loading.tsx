import { Skeleton } from "@/shared/ui/Skeleton";

export default function Loading() {
  return (
    <div className="pt-2">
      <Skeleton className="mb-2 h-8 w-20 rounded-lg" />
      <Skeleton className="mb-1 h-6 w-36" />
      <Skeleton className="mb-5 h-3.5 w-44" />

      {[0, 1].map((i) => (
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
