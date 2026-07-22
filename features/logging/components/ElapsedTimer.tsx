"use client";

import { useEffect, useState } from "react";
import { formatDuration } from "@/shared/lib/date";

export function ElapsedTimer({
  startTs,
  className = "-mt-1 mb-4 text-center",
}: {
  startTs: number;
  className?: string;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={className}>
      <span className="rounded-full bg-surface-2 px-4 py-1.5 text-[15px] font-bold tabular-nums text-blue">
        {formatDuration((now - startTs) / 1000)}
      </span>
    </div>
  );
}
