"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Sheet } from "@/shared/ui/Sheet";
import { ChevronUpIcon, StrengthIcon } from "@/shared/ui/icons";
import { ElapsedTimer } from "../components/ElapsedTimer";

type ActiveWorkoutMeta = { title: string; startTs: number };

type ActiveWorkoutContextValue = {
  isActive: boolean;
  isMinimized: boolean;
  meta: ActiveWorkoutMeta | null;
  /** Starts a new active workout. If one is already running, this just
   * restores it instead — so re-tapping "Start routine" elsewhere never
   * silently discards in-progress sets. */
  start: (meta: ActiveWorkoutMeta, content: ReactNode) => void;
  minimize: () => void;
  restore: () => void;
  /** Fully ends the active workout (finished or discarded). */
  end: () => void;
};

const ActiveWorkoutContext = createContext<ActiveWorkoutContextValue | null>(null);

export function useActiveWorkout() {
  const ctx = useContext(ActiveWorkoutContext);
  if (!ctx) throw new Error("useActiveWorkout must be used within <ActiveWorkoutProvider>");
  return ctx;
}

/**
 * Mounted once in the root layout, alongside `SheetHost`. Keeps a running
 * workout's screen mounted (so its state and timer survive) while the user
 * navigates to other pages, by rendering it in its own overlay instead of
 * tying it to route content. Minimizing just hides that overlay and shows a
 * small bar above `BottomNav`; nothing here touches routing or history.
 */
export function ActiveWorkoutProvider({ children }: { children: ReactNode }) {
  const [meta, setMeta] = useState<ActiveWorkoutMeta | null>(null);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const isActive = meta !== null;

  const start = useCallback(
    (nextMeta: ActiveWorkoutMeta, nextContent: ReactNode) => {
      setMeta((current) => current ?? nextMeta);
      setContent((current) => current ?? nextContent);
      setIsMinimized(false);
    },
    []
  );

  const minimize = useCallback(() => setIsMinimized(true), []);
  const restore = useCallback(() => setIsMinimized(false), []);

  const end = useCallback(() => {
    setMeta(null);
    setContent(null);
    setIsMinimized(false);
  }, []);

  // Lock the page behind the full-screen overlay, matching SheetHost's own
  // scroll lock — but only while maximized; minimized leaves the page
  // underneath fully interactive.
  useEffect(() => {
    if (!isActive || isMinimized) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isActive, isMinimized]);

  const value = useMemo<ActiveWorkoutContextValue>(
    () => ({ isActive, isMinimized, meta, start, minimize, restore, end }),
    [isActive, isMinimized, meta, start, minimize, restore, end]
  );

  return (
    <ActiveWorkoutContext.Provider value={value}>
      {children}
      {isActive && (
        <Sheet open={!isMinimized} onClose={minimize} zIndex={35}>
          <div className="max-h-[92dvh] overflow-y-auto overscroll-contain md:max-h-[88dvh]">
            {content}
          </div>
        </Sheet>
      )}
      {isActive && isMinimized && meta && <MiniWorkoutBar meta={meta} onRestore={restore} />}
    </ActiveWorkoutContext.Provider>
  );
}

function MiniWorkoutBar({
  meta,
  onRestore,
}: {
  meta: ActiveWorkoutMeta;
  onRestore: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRestore}
      aria-label={`Resume ${meta.title}`}
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 68px)" }}
      className="fixed inset-x-0 z-31 mx-auto flex w-[calc(100%-2.25rem)] max-w-130 items-center gap-3 rounded-2xl border border-line bg-[rgba(24,24,26,0.96)] px-4 py-3 text-left shadow-[0_10px_34px_rgba(0,0,0,0.55)] backdrop-blur-md md:max-w-180 lg:max-w-250 xl:max-w-280"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-dim text-blue">
        <StrengthIcon />
      </span>
      <span className="min-w-0 flex-1 truncate text-[14.5px] font-bold tracking-tight">
        {meta.title}
      </span>
      <ElapsedTimer startTs={meta.startTs} className="shrink-0" />
      <ChevronUpIcon />
    </button>
  );
}
