import { ArrowRight } from "lucide-react";
import { codeSamples } from "~/lib/content";
import { SectionHeading } from "~/components/SectionHeading";
import { Reveal } from "~/components/Reveal";
import { cn } from "~/lib/utils";

const panels = [
  { label: "INBOUND", sub: "shopify · webhook", code: codeSamples.inbound, accent: "#7be08a" },
  { label: "SPINE", sub: "normalize · route", code: codeSamples.canonical, accent: "#22d3ee" },
  { label: "OUTBOUND", sub: "wms · dispatch", code: codeSamples.outbound, accent: "#c084fc" },
];

/** Very small token tinter — enough to read like real code, no dependency. */
function highlight(line: string) {
  return line
    .replace(/(\/\/.*)$/g, '<span class="text-faint italic">$1</span>')
    .replace(/("[^"]*")/g, '<span class="text-emerald">$1</span>')
    .replace(/\b(const|emit|POST|map|hash|normalize|route)\b/g, '<span class="text-violet">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-amber">$1</span>');
}

function CodePanel({
  label,
  sub,
  code,
  accent,
  caret,
}: (typeof panels)[number] & { caret?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line/80 bg-[#060a14]/90 backdrop-blur-md">
      {/* scanline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 animate-scan"
        style={{
          background: `linear-gradient(to bottom, ${accent}22, transparent)`,
        }}
      />
      <div className="flex items-center justify-between border-b border-line/70 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/70" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          {sub}
        </span>
      </div>
      <div className="flex items-center gap-2 px-4 pt-3 font-mono text-[10px] uppercase tracking-[0.2em]">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
        />
        <span style={{ color: accent }}>{label}</span>
      </div>
      <pre className="overflow-x-auto px-4 pb-5 pt-2 text-[11.5px] leading-relaxed sm:text-xs">
        <code className="font-mono text-ink/90">
          {code.split("\n").map((line, i) => (
            <div key={i} className="whitespace-pre">
              <span
                className={cn(
                  caret && i === code.split("\n").length - 1 && "caret",
                )}
                dangerouslySetInnerHTML={{ __html: highlight(line) || "&nbsp;" }}
              />
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

export function CodeStream() {
  return (
    <section id="approach" className="relative px-5 py-28 md:py-36">
      <SectionHeading
        index="04"
        tag="Under the hood"
        title={<>Watch a payload become an instruction.</>}
      >
        This is the layer most teams never see — the translation between
        systems that each insist the world looks like them. We live here.
      </SectionHeading>

      <div className="mx-auto mt-14 grid max-w-6xl items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <Reveal>
          <CodePanel {...panels[0]} />
        </Reveal>
        <div className="flex items-center justify-center text-cyan lg:flex-col">
          <ArrowRight className="size-6 animate-pulse" />
        </div>
        <Reveal delay={0.1}>
          <CodePanel {...panels[1]} />
        </Reveal>
        <div className="flex items-center justify-center text-violet lg:flex-col">
          <ArrowRight className="size-6 animate-pulse" />
        </div>
        <Reveal delay={0.2}>
          <CodePanel {...panels[2]} caret />
        </Reveal>
      </div>
    </section>
  );
}
