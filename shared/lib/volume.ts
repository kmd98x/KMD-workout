type VolumeSet = {
  weight?: string;
  reps?: string;
  warmup?: boolean;
};

type VolumeExercise = {
  cardio: boolean;
  sets: VolumeSet[];
};

export function computeSessionVolume(exercises: VolumeExercise[]): number {
  let volume = 0;
  for (const ex of exercises) {
    if (ex.cardio) continue;
    for (const s of ex.sets) {
      if (s.warmup) continue;
      const reps = Number(s.reps) || 0;
      const weight = Number(s.weight) || 0;
      if (reps > 0) volume += weight * reps;
    }
  }
  return volume;
}
