import { useEffect, useRef } from "react";

/**
 * Canvas "matrix" rain made of 0s and 1s. Throttled to ~24fps, capped column
 * count, and static (single paint) when the user prefers reduced motion.
 * Purely decorative — sits behind content with pointer-events disabled.
 */
export function BinaryRain({
  className,
  color = "#22d3ee",
  fontSize = 16,
  opacity = 0.5,
}: {
  className?: string;
  color?: string;
  fontSize?: number;
  opacity?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let drops: number[] = [];
    let dpr = 1;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth ?? window.innerWidth;
      const h = parent?.clientHeight ?? window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / fontSize);
      drops = Array.from({ length: cols }, () => Math.floor((Math.random() * h) / fontSize));
    };
    resize();

    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      // Translucent wash creates the fading trail.
      ctx.fillStyle = "rgba(4,6,13,0.16)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      for (let i = 0; i < cols; i++) {
        const char = Math.random() > 0.5 ? "1" : "0";
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        // Leading bit glows brighter than the trail.
        ctx.fillStyle = Math.random() > 0.92 ? "#e6edf7" : color;
        ctx.fillText(char, x, y);
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    if (reduced) {
      // Single static field of bits.
      ctx.fillStyle = "rgba(4,6,13,1)";
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.fillStyle = color;
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < (canvas.height / dpr / fontSize) * 0.4; j++)
          ctx.fillText(
            Math.random() > 0.5 ? "1" : "0",
            i * fontSize,
            Math.random() * (canvas.height / dpr),
          );
      return;
    }

    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 42) return; // ~24fps
      last = t;
      draw();
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [color, fontSize]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ opacity }}
    />
  );
}
