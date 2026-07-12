"use client";

import { useAuthActions } from "@convex-dev/auth/react";

export default function WorkoutHomePage() {
  const { signOut } = useAuthActions();

  return (
    <div className="pt-2">
      <div className="flex items-baseline justify-between pt-[26px] pb-[18px]">
        <div>
          <div className="text-[26px] font-extrabold tracking-tight">
            <span className="text-blue">Steady</span>
          </div>
          <p className="text-[12.5px] text-muted-2">
            Workout home &mdash; coming in the next milestone.
          </p>
        </div>
        <button
          onClick={() => void signOut()}
          className="rounded-lg bg-surface-2 px-3 py-2 text-[13px] font-semibold text-muted hover:text-ink"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
