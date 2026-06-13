import { useEffect } from "react";
import { clamp } from "./utils";

/**
 * A tiny, render-free store shared between the scrolling DOM and the WebGL
 * scene. The 3D scene reads these values inside `useFrame` every tick, so we
 * deliberately avoid React state here to keep the render loop allocation-free.
 */
export const motionState = {
  /** Normalized document scroll progress, 0 → 1. */
  progress: 0,
  /** Raw scroll position in pixels. */
  scrollY: 0,
  /** Pointer position normalized to -1 → 1, used for parallax. */
  pointerX: 0,
  pointerY: 0,
  /** Section index the viewport is currently centered on. */
  section: 0,
  /** Total number of full-height scenes, used to derive `section`. */
  sceneCount: 6,
};

/**
 * Attaches global scroll + pointer listeners exactly once and feeds the
 * {@link motionState} singleton. Returns nothing — consumers read the store.
 */
export function useMotionStateListeners(sceneCount = 6) {
  useEffect(() => {
    motionState.sceneCount = sceneCount;

    let raf = 0;
    const readScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      motionState.scrollY = window.scrollY;
      motionState.progress = max > 0 ? clamp(window.scrollY / max) : 0;
      motionState.section = Math.round(
        motionState.progress * (sceneCount - 1),
      );
      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(readScroll);
    };

    const onPointer = (e: PointerEvent) => {
      motionState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      motionState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    // Device orientation drives parallax on touch devices that lack a pointer.
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      motionState.pointerX = clamp(e.gamma / 45, -1, 1);
      motionState.pointerY = clamp((e.beta - 45) / 45, -1, 1);
    };

    readScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onOrient, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onOrient);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sceneCount]);
}
