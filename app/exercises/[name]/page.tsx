import { ExerciseDetailTabs } from "@/features/exercises/components/ExerciseDetailTabs";

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  return <ExerciseDetailTabs name={decodeURIComponent(name)} />;
}
