import { motion } from "motion/react";
import { ArrowDown, Plug } from "lucide-react";
import { brand } from "~/lib/content";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

const PIPES = ["3PL", "ERP", "WMS", "SHOPIFY", "POS", "PAYMENTS", "MARKETPLACE"];

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-5 pt-24 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center"
      >
        <Badge className="mb-6">
          <Plug className="size-3" />
          systems integration engineering
        </Badge>

        <h1 className="max-w-4xl text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          We build the{" "}
          <span className="gradient-text text-glow">connective tissue</span>{" "}
          beneath modern commerce.
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-mute sm:text-lg">
          Deep, resilient integrations between the systems that run your
          business — Shopify, ERP, WMS, 3PL, POS and beyond. Scroll down and
          travel through the mesh.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href="#contact">Architect my integration</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#mesh">Explore the mesh</a>
          </Button>
        </div>
      </motion.div>

      {/* Marquee of connected systems */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="mask-x absolute bottom-24 left-0 w-full overflow-hidden md:bottom-28"
      >
        <div className="flex w-max animate-marquee gap-10 font-mono text-xs uppercase tracking-[0.3em] text-faint">
          {[...PIPES, ...PIPES].map((p, i) => (
            <span key={i} className="flex items-center gap-10">
              {p}
              <span className="text-cyan/40">/</span>
            </span>
          ))}
        </div>
      </motion.div>

      <motion.a
        href="#mesh"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-faint"
      >
        descend
        <ArrowDown className="size-4 animate-bounce text-cyan" />
      </motion.a>
    </section>
  );
}
