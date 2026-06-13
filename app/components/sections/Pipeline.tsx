import { pipeline } from "~/lib/content";
import { SectionHeading } from "~/components/SectionHeading";
import { Reveal } from "~/components/Reveal";

export function Pipeline() {
  return (
    <section id="pipeline" className="relative px-5 py-28 md:py-36">
      <SectionHeading
        index="03"
        tag="The pipeline"
        title={<>Follow one order through the mesh.</>}
      >
        A single checkout fans out across half a dozen systems in under a
        second — without ever double-charging, double-shipping, or losing the
        thread.
      </SectionHeading>

      <ol className="relative mx-auto mt-16 max-w-3xl">
        {/* Vertical conduit */}
        <span
          aria-hidden
          className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan via-violet to-magenta opacity-40 md:left-1/2"
        />
        {pipeline.map((p, i) => (
          <Reveal key={p.step} delay={i * 0.05}>
            <li
              className={`relative mb-10 flex flex-col gap-4 md:flex-row md:items-center ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Node marker */}
              <span className="absolute left-[18px] z-10 flex h-5 w-5 -translate-x-px items-center justify-center md:left-1/2 md:-translate-x-1/2">
                <span className="h-3 w-3 rounded-full bg-cyan shadow-[0_0_16px_var(--color-cyan)]" />
              </span>

              <div className="md:w-1/2" />
              <div
                className={`ml-12 rounded-2xl border border-line/80 bg-card/60 p-6 backdrop-blur-md md:ml-0 md:w-1/2 ${
                  i % 2 === 1 ? "md:mr-12" : "md:ml-12"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl font-bold text-cyan/30">
                    {p.step}
                  </span>
                  <span className="rounded-full border border-line bg-muted px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                    {p.from}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  {p.detail}
                </p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
