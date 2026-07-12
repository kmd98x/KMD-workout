import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { RoutineDetail } from "@/features/workout/components/RoutineDetail";

export default async function RoutineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await convexAuthNextjsToken();
  const preloaded = await preloadQuery(
    api.workout.getRoutine,
    { id: id as Id<"routines"> },
    { token }
  );
  return <RoutineDetail preloaded={preloaded} />;
}
