import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { brand, navLinks } from "~/lib/content";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-line/60 glass" : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-8">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-md border border-cyan/60 transition-transform duration-500 group-hover:rotate-90" />
            <span className="h-2.5 w-2.5 rounded-sm bg-cyan shadow-[0_0_14px_var(--color-cyan)]" />
          </span>
          <span className="font-mono text-sm font-bold tracking-[0.3em] text-ink">
            {brand.name}
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs uppercase tracking-[0.18em] text-mute transition-colors hover:text-cyan"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Button asChild size="sm" variant="outline">
            <a href="#contact">Start a build</a>
          </Button>
        </div>

        <button
          className="text-ink md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile sheet */}
      <div
        className={cn(
          "overflow-hidden border-t border-line/60 glass transition-[max-height] duration-300 md:hidden",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <div className="flex flex-col gap-1 px-5 py-3">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 font-mono text-sm uppercase tracking-[0.18em] text-mute transition-colors hover:bg-white/5 hover:text-cyan"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-cyan px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
          >
            Start a build
          </a>
        </div>
      </div>
    </header>
  );
}
