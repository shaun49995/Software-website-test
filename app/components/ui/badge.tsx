import * as React from "react";
import { cn } from "~/lib/utils";

/** A small monospace status pill used throughout the HUD-styled UI. */
export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan",
        className,
      )}
      {...props}
    />
  );
}
