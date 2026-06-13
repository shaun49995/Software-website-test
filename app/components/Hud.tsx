import { useEffect, useState } from "react";
import { motionState } from "~/lib/scroll-store";

const PHASES = [
  "BOOT",
  "MESH",
  "SYSTEMS",
  "PIPELINE",
  "APPROACH",
  "UPLINK",
];

/**
 * A thin "virtual system" heads-up display fixed to the viewport edge. Reads
 * the shared motion store on a rAF loop and paints scroll depth + a fake live
 * telemetry readout, reinforcing the "inside the system" feeling.
 */
export function Hud() {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setPct(Math.round(motionState.progress * 100));
      setPhase(motionState.section);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 pb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
        <div className="flex items-center gap-3">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald shadow-[0_0_8px_var(--color-emerald)]" />
          <span className="text-mute">conduit://mesh.live</span>
          <span>lat 182ms</span>
          <span className="text-cyan">phase {PHASES[phase] ?? "MESH"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>depth</span>
          <div className="h-1 w-40 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan to-violet transition-[width] duration-150"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="tabular-nums text-cyan">{String(pct).padStart(3, "0")}%</span>
        </div>
      </div>
    </div>
  );
}
