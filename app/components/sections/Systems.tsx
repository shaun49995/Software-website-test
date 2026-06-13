import { systems } from "~/lib/content";
import { SectionHeading } from "~/components/SectionHeading";
import { Reveal } from "~/components/Reveal";

export function Systems() {
  return (
    <section id="systems" className="relative px-5 py-28 md:py-36">
      <SectionHeading
        index="02"
        tag="The endpoints"
        title={<>Every system, speaking one language.</>}
      >
        We don't just move data between tools — we give your whole stack a
        shared, versioned source of truth. Here's what we wire in.
      </SectionHeading>

      <div className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {systems.map((s, i) => (
          <Reveal key={s.key} delay={(i % 3) * 0.06}>
            <article
              className="group relative h-full overflow-hidden rounded-2xl border border-line/80 bg-card/50 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-line"
              style={{ ["--sys" as string]: s.color }}
            >
              {/* Color wash that reacts on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-50"
                style={{ background: s.color }}
              />
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    background: s.color,
                    boxShadow: `0 0 14px ${s.color}`,
                  }}
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                  {s.short}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">
                {s.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{s.blurb}</p>
              <div
                className="mt-5 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{
                  background: `linear-gradient(90deg, ${s.color}, transparent)`,
                }}
              />
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
