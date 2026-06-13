import { capabilities, stats } from "~/lib/content";
import { Reveal } from "~/components/Reveal";
import { CountUp } from "~/components/CountUp";

export function Capabilities() {
  return (
    <section className="relative px-5 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-4 md:grid-cols-2">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={(i % 2) * 0.08}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-line/80 bg-card/50 p-7 backdrop-blur-md transition-colors hover:border-cyan/40">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-grid opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="relative font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">
                  {c.tag}
                </span>
                <h3 className="relative mt-3 text-xl font-semibold tracking-tight">
                  {c.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-mute">
                  {c.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Stat strip */}
        <Reveal delay={0.1}>
          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/80 bg-line/60 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-card/70 p-6 text-center backdrop-blur-md">
                <CountUp
                  value={s.value}
                  className="gradient-text block font-mono text-2xl font-bold sm:text-3xl"
                />
                <span className="sr-only">{s.value}</span>
                <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
