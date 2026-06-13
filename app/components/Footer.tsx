import { brand, navLinks } from "~/lib/content";

export function Footer() {
  return (
    <footer className="relative border-t border-line/60 px-5 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-cyan shadow-[0_0_14px_var(--color-cyan)]" />
          <span className="font-mono text-sm font-bold tracking-[0.3em]">
            {brand.name}
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs uppercase tracking-[0.16em] text-faint transition-colors hover:text-cyan"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <p className="font-mono text-[11px] text-faint">
          © {new Date().getFullYear()} {brand.full}
        </p>
      </div>
    </footer>
  );
}
