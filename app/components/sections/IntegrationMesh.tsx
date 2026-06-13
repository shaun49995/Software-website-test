import { systems } from "~/lib/content";
import { SectionHeading } from "~/components/SectionHeading";
import { Reveal } from "~/components/Reveal";

const readouts = [
  { k: "nodes online", v: "8 / 8" },
  { k: "conduits", v: "15" },
  { k: "in-flight events", v: "1,284" },
  { k: "schema version", v: "canonical.v3" },
];

export function IntegrationMesh() {
  return (
    <section id="mesh" className="relative px-5 py-28 md:py-36">
      <SectionHeading
        index="01"
        tag="The mesh"
        title={
          <>
            You're inside the <span className="gradient-text">integration layer</span> right now.
          </>
        }
      >
        Each glowing node is a system. The lines between them are live data
        conduits, and the sparks travelling along them are real events — orders,
        stock changes, fulfilments. This is how your business actually talks to
        itself.
      </SectionHeading>

      {/* Live-ish telemetry strip */}
      <Reveal>
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/80 bg-line/60 sm:grid-cols-4">
          {readouts.map((r) => (
            <div key={r.k} className="bg-card/70 p-5 text-center backdrop-blur-md">
              <div className="font-mono text-xl font-bold text-cyan sm:text-2xl">
                {r.v}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                {r.k}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Node legend */}
      <Reveal delay={0.1}>
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2.5">
          {systems.map((s) => (
            <span
              key={s.key}
              className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mute"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }}
              />
              {s.label}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
