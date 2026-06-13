import { useMemo, useState } from "react";
import { protocols, signalFeed } from "~/lib/content";
import { SectionHeading } from "~/components/SectionHeading";
import { Reveal } from "~/components/Reveal";
import { BinaryRain } from "~/components/BinaryRain";

interface LogLine {
  ts: string;
  bits: string;
  op: string;
  from: string;
  to: string;
  status: string;
  hex: string;
}

/**
 * Deterministic, seeded log lines. Generated identically on server and client
 * (no Date / Math.random), so hydration matches and there's no flicker.
 */
function buildLines(count: number): LogLine[] {
  let s = 1337;
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  const pad = (n: number, w: number) => String(n).padStart(w, "0");
  return Array.from({ length: count }, () => {
    const op = signalFeed.ops[Math.floor(rnd() * signalFeed.ops.length)];
    const status = signalFeed.statuses[Math.floor(rnd() * signalFeed.statuses.length)];
    const hex = Array.from({ length: 4 }, () =>
      Math.floor(rnd() * 256).toString(16).padStart(2, "0"),
    ).join("");
    const ts = `${pad(10 + Math.floor(rnd() * 49), 2)}:${pad(Math.floor(rnd() * 60), 2)}.${pad(Math.floor(rnd() * 1000), 3)}`;
    return { ts, bits: op.bits, op: op.name, from: op.from, to: op.to, status, hex };
  });
}

export function Signal() {
  const lines = useMemo(() => buildLines(16), []);
  const [paused, setPaused] = useState(false);

  return (
    <section id="signal" className="relative overflow-hidden px-5 py-28 md:py-36">
      <BinaryRain
        className="pointer-events-none absolute inset-0 h-full w-full"
        opacity={0.12}
        color="#22d3ee"
        fontSize={18}
      />
      <div className="relative">
        <SectionHeading
          index="03"
          tag="The signal"
          title={
            <>
              Below the UI, it's all <span className="gradient-text">ones and zeros</span> in motion.
            </>
          }
        >
          A live tap into the event bus. Every line is a real message type
          flowing between systems — opcode, route, and acknowledgement, on the
          wire.
        </SectionHeading>

        <Reveal>
          <div
            className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-xl border border-line/80 bg-[#060a14]/90 backdrop-blur-md"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="flex items-center justify-between border-b border-line/70 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/70" />
              </div>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald shadow-[0_0_8px_var(--color-emerald)]" />
                signal://event-stream
              </span>
            </div>

            {/* Continuous, transform-only scroll — no DOM reordering, so it
                never reflows or jumps. The track holds two copies for a
                seamless loop. */}
            <div className="relative h-[260px] overflow-hidden font-mono text-[11px] leading-[26px] sm:text-xs">
              <div
                className="absolute inset-x-0 top-0 px-4 will-change-transform"
                style={{
                  animation: "scroll-y 26s linear infinite",
                  animationPlayState: paused ? "paused" : "running",
                }}
              >
                {[...lines, ...lines].map((l, i) => (
                  <div
                    key={i}
                    className="flex h-[26px] items-center gap-x-2 overflow-hidden whitespace-nowrap"
                  >
                    <span className="text-faint">{l.ts}</span>
                    <span className="text-amber">{l.bits}</span>
                    <span className="text-faint">0x{l.hex}</span>
                    <span className="text-cyan">{l.op}</span>
                    <span className="text-faint">{l.from}</span>
                    <span className="text-violet">→</span>
                    <span className="text-mute">{l.to}</span>
                    <span className="text-emerald">{l.status}</span>
                  </div>
                ))}
              </div>

              {/* top/bottom fade + pinned prompt */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, #060a14 0%, transparent 18%, transparent 72%, #060a14 96%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 flex h-9 items-center gap-2 border-t border-line/60 bg-[#060a14] px-4 text-emerald">
                <span className="text-faint">$</span>
                <span className="caret">tail -f bus</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Protocol marquee */}
        <Reveal delay={0.1}>
          <div className="mask-x mt-10 overflow-hidden">
            <div className="flex w-max animate-marquee gap-3">
              {[...protocols, ...protocols].map((p, i) => (
                <span
                  key={i}
                  className="rounded-full border border-line bg-card/50 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-mute"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
