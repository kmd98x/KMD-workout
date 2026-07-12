import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { SessionDetail } from "@/features/logging/components/SessionDetail";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await convexAuthNextjsToken();
  const preloaded = await preloadQuery(
    api.logging.getSession,
    { id: id as Id<"sessions"> },
    { token }
  );
  return <SessionDetail preloaded={preloaded} />;
}
