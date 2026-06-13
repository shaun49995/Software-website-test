import { useEffect, useRef, useState } from "react";

/**
 * Counts a numeric value up when it scrolls into view. Preserves any
 * non-numeric prefix/suffix (e.g. "<", "%", "M+", "ms") around the number.
 */
export function CountUp({
  value,
  duration = 1400,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const done = useRef(false);

  const match = value.match(/^(\D*)([\d.]+)(.*)$/);

  useEffect(() => {
    if (!match) return;
    const el = ref.current;
    if (!el) return;
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const decimals = (numStr.split(".")[1] ?? "").length;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }

    setDisplay(`${prefix}0${suffix}`);

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || done.current) return;
        done.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const current = (target * eased).toFixed(decimals);
          setDisplay(`${prefix}${current}${suffix}`);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration, match]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
