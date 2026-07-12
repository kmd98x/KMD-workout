/** Epley formula estimated 1-rep max. */
export function epley1RM(weight: number, reps: number): number {
  return weight * (1 + reps / 30);
}
