import { useMemo } from "react";
import { cn } from "~/lib/utils";

/** Deterministic bit string so SSR and client markup match (no hydration warp). */
function bits(seed: number, len: number) {
  let s = seed;
  let out = "";
  for (let i = 0; i < len; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    out += s % 2 === 0 ? "0" : "1";
    if (i % 8 === 7) out += " ";
  }
  return out;
}

/**
 * A thin strip of 0/1 streaming sideways — a "wire" between sections. Two
 * copies animate via the marquee keyframe for a seamless loop.
 */
export function BitstreamDivider({
  className,
  reverse = false,
}: {
  className?: string;
  reverse?: boolean;
}) {
  const stream = useMemo(() => bits(reverse ? 7919 : 104729, 160), [reverse]);
  return (
    <div
      aria-hidden
      className={cn("relative w-full overflow-hidden py-3 mask-x", className)}
    >
      <div
        className="flex w-max gap-6 font-mono text-[11px] tracking-[0.25em] text-cyan/30 will-change-transform"
        style={{
          animation: `marquee ${reverse ? "48s" : "40s"} linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <span className="whitespace-nowrap">{stream}</span>
        <span className="whitespace-nowrap">{stream}</span>
      </div>
    </div>
  );
}
