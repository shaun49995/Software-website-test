import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { protocols, signalFeed } from "~/lib/content";
import { SectionHeading } from "~/components/SectionHeading";
import { Reveal } from "~/components/Reveal";
import { BinaryRain } from "~/components/BinaryRain";

interface LogLine {
  id: number;
  ts: string;
  bits: string;
  op: string;
  from: string;
  to: string;
  status: string;
  hex: string;
}

let counter = 0;
function makeLine(): LogLine {
  const op = signalFeed.ops[Math.floor(Math.random() * signalFeed.ops.length)];
  const status = signalFeed.statuses[Math.floor(Math.random() * signalFeed.statuses.length)];
  const hex = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, "0"),
  ).join("");
  const now = new Date();
  const ts = `${now.getMinutes().toString().padStart(2, "0")}:${now
    .getSeconds()
    .toString()
    .padStart(2, "0")}.${now.getMilliseconds().toString().padStart(3, "0")}`;
  return { id: counter++, ts, bits: op.bits, op: op.name, from: op.from, to: op.to, status, hex };
}

export function Signal() {
  const [lines, setLines] = useState<LogLine[]>(() =>
    Array.from({ length: 7 }, makeLine),
  );
  const paused = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const tick = () => {
      if (!paused.current && !document.hidden) {
        setLines((prev) => [...prev.slice(-7), makeLine()]);
      }
    };
    const interval = setInterval(tick, 850);
    return () => clearInterval(interval);
  }, []);

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
            onMouseEnter={() => (paused.current = true)}
            onMouseLeave={() => (paused.current = false)}
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

            {/* Fixed-height, bottom-anchored log: rows are single-line and a
                constant height, so new entries scroll up without reflowing. */}
            <div className="flex h-[268px] flex-col justify-end gap-0 overflow-hidden p-4 font-mono text-[11px] leading-6 sm:text-xs">
              {lines.map((l) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-6 shrink-0 items-center gap-x-2 overflow-hidden whitespace-nowrap"
                >
                  <span className="text-faint">{l.ts}</span>
                  <span className="text-amber">{l.bits}</span>
                  <span className="text-faint">0x{l.hex}</span>
                  <span className="text-cyan">{l.op}</span>
                  <span className="text-faint">{l.from}</span>
                  <span className="text-violet">→</span>
                  <span className="text-mute">{l.to}</span>
                  <span className="text-emerald">{l.status}</span>
                </motion.div>
              ))}
              <div className="flex h-6 shrink-0 items-center gap-2 text-emerald">
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
