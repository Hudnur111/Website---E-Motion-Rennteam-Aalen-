"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import type { Vehicle } from "@/lib/content";

const TYPE_SPEED_MS = 18;
const LINE_PAUSE_MS = 260;
const START_DELAY_MS = 350;

export default function TerminalSpecs({ specs }: { specs: NonNullable<Vehicle["specs"]> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [visibleChars, setVisibleChars] = useState(0);

  const fullText = specs.map((s) => `${s.label}: ${s.value}`).join("\n");
  const done = reduceMotion || visibleChars >= fullText.length;

  // Reduced-motion users skip the animation entirely: the full text is
  // rendered straight away via `done`/the slice below, no state update needed.
  useEffect(() => {
    if (!inView || reduceMotion) return;
    let cancelled = false;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    function tick() {
      if (cancelled) return;
      i += 1;
      setVisibleChars(i);
      if (i >= fullText.length) return;
      const nextDelay = fullText[i - 1] === "\n" ? LINE_PAUSE_MS : TYPE_SPEED_MS;
      timer = setTimeout(tick, nextDelay);
    }
    timer = setTimeout(tick, START_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion]);

  const shownLines = (reduceMotion ? fullText : fullText.slice(0, visibleChars)).split("\n");

  return (
    <div
      ref={ref}
      className="mx-auto mt-14 max-w-2xl overflow-hidden rounded-xl border border-border bg-[#0a0c12] shadow-[0_0_40px_-15px_rgba(74,99,247,0.35)]"
    >
      <div className="flex items-center gap-1.5 border-b border-border/60 bg-surface-2 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 font-mono text-xs text-muted">technische-daten.sh</span>
      </div>
      <div className="p-5 font-mono text-sm leading-relaxed">
        <p className="text-muted">
          <span className="text-accent-text">ert@emotion</span>
          <span className="text-muted">:~$</span> cat technische-daten.txt
        </p>
        {shownLines.map((line, i) => (
          <p key={i} className="mt-1 whitespace-pre-wrap break-words text-[#8ef58e]">
            {line}
            {!done && i === shownLines.length - 1 && (
              <span
                aria-hidden="true"
                className="terminal-cursor ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-[#8ef58e] align-middle"
              />
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
