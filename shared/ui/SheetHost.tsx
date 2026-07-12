"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Sheet } from "./Sheet";

type SheetEntry = { key: string; content: ReactNode };

type SheetContextValue = {
  /** Push a new sheet onto the stack (e.g. open the exercise picker on top of the routine editor). */
  push: (key: string, content: ReactNode) => void;
  /** Close the top-most sheet. */
  pop: () => void;
  /** Swap the top-most sheet's content without animating a close/open. */
  replace: (key: string, content: ReactNode) => void;
  /** Close every open sheet. */
  closeAll: () => void;
};

const SheetContext = createContext<SheetContextValue | null>(null);

export function useSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("useSheet must be used within <SheetHost>");
  return ctx;
}

/**
 * Mounted once in the root layout. Owns a stack of sheet contents so nested
 * flows (e.g. "add exercise" opened from inside the routine editor) are just
 * another push, matching the prototype's single-overlay-with-swapped-contents
 * behavior instead of routes.
 */
export function SheetHost({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<SheetEntry[]>([]);

  const push = useCallback((key: string, content: ReactNode) => {
    setStack((s) => [...s, { key, content }]);
  }, []);
  const pop = useCallback(() => {
    setStack((s) => s.slice(0, -1));
  }, []);
  const replace = useCallback((key: string, content: ReactNode) => {
    setStack((s) => [...s.slice(0, -1), { key, content }]);
  }, []);
  const closeAll = useCallback(() => setStack([]), []);

  return (
    <SheetContext.Provider value={{ push, pop, replace, closeAll }}>
      {children}
      <Sheet open={stack.length > 0} onClose={pop}>
        {/* Every stacked entry stays mounted (only display:none'd when not
            on top) so state and timers in a lower sheet (e.g. a routine
            draft, or a running workout timer) survive a nested push/pop
            like opening the exercise picker on top of it. */}
        {stack.map((entry, i) => (
          <div key={entry.key} hidden={i !== stack.length - 1}>
            {entry.content}
          </div>
        ))}
      </Sheet>
    </SheetContext.Provider>
  );
}
