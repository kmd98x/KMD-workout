import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { WorkoutHome } from "@/features/workout/components/WorkoutHome";

export default async function WorkoutHomePage() {
  const token = await convexAuthNextjsToken();
  const preloaded = await preloadQuery(
    api.workout.listFoldersAndRoutines,
    {},
    { token }
  );
  return <WorkoutHome preloaded={preloaded} />;
}
