import { artInner } from "../library/exArt";

export function ExerciseThumb({ name }: { name: string }) {
  return (
    <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[11px] bg-surface-2">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[30px] w-[30px] text-thumb"
        dangerouslySetInnerHTML={{ __html: artInner(name) }}
      />
    </div>
  );
}
