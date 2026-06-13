import { useEffect, useMemo, useState } from "react";
import { cn } from "~/lib/utils";

/**
 * Renders a string as a binary/ascii dump — offset, four binary octets per
 * row, and the decoded characters — with a highlight that scans byte by byte,
 * dramatizing the "it's all bits on the wire" idea.
 */
export function HexDump({
  text,
  bytesPerRow = 4,
  className,
}: {
  text: string;
  bytesPerRow?: number;
  className?: string;
}) {
  const bytes = useMemo(() => Array.from(text, (c) => c.charCodeAt(0)), [text]);
  const [cursor, setCursor] = useState(-1);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(
      () => setCursor((c) => (c + 1) % bytes.length),
      140,
    );
    return () => clearInterval(id);
  }, [bytes.length]);

  const rows: number[][] = [];
  for (let i = 0; i < bytes.length; i += bytesPerRow) {
    rows.push(bytes.slice(i, i + bytesPerRow).map((_, j) => i + j));
  }

  return (
    <div className={cn("overflow-x-auto font-mono text-[10.5px] leading-relaxed sm:text-[11px]", className)}>
      {rows.map((row, r) => (
        <div key={r} className="flex gap-3 whitespace-nowrap">
          <span className="text-faint">
            0x{(r * bytesPerRow).toString(16).padStart(4, "0")}
          </span>
          <span className="flex gap-2">
            {row.map((idx) => (
              <span
                key={idx}
                className={cn(
                  "transition-colors duration-150",
                  idx === cursor ? "text-ink" : "text-cyan/70",
                )}
                style={
                  idx === cursor
                    ? { textShadow: "0 0 10px var(--color-cyan)" }
                    : undefined
                }
              >
                {bytes[idx].toString(2).padStart(8, "0")}
              </span>
            ))}
          </span>
          <span className="text-mute">
            {row.map((idx) => (
              <span
                key={idx}
                className={cn(idx === cursor && "text-amber")}
              >
                {text[idx] === " " ? "·" : text[idx]}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
