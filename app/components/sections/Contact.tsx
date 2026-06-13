import { ArrowUpRight, Mail } from "lucide-react";
import { brand } from "~/lib/content";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Reveal } from "~/components/Reveal";

export function Contact() {
  return (
    <section id="contact" className="relative px-5 py-28 md:py-40">
      <Reveal>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-cyan/20 bg-card/40 px-6 py-16 text-center backdrop-blur-xl sm:px-12">
          <div aria-hidden className="absolute inset-0 bg-grid opacity-60" />
          <div
            aria-hidden
            className="absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)" }}
          />

          <div className="relative">
            <Badge className="mb-6">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
              accepting new builds
            </Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
              Got systems that{" "}
              <span className="gradient-text">won't talk</span> to each other?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-mute">
              Tell us about your stack. We'll map the mesh, find the failure
              modes, and architect an integration that holds up under real
              traffic.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href={`mailto:${brand.email}`}>
                  <Mail className="size-4" />
                  {brand.email}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={`mailto:${brand.email}?subject=Integration%20build`}>
                  Book a scoping call
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
