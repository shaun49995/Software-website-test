import { lazy, Suspense } from "react";
import { ClientOnly } from "~/components/ClientOnly";
import { SceneBoundary } from "./SceneBoundary";

// Lazy-load the WebGL scene so three.js / postprocessing stay out of the
// initial bundle — the page content paints immediately, the mesh streams in.
const IntegrationScene = lazy(() =>
  import("./IntegrationScene").then((m) => ({ default: m.IntegrationScene })),
);

/**
 * Fixed, full-viewport WebGL layer that the entire page scrolls over. Rendered
 * client-side only. A CSS gradient stands in during SSR / hydration so there's
 * never a flash of empty black.
 */
export function SceneBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-[100dvh] w-full">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, #0a1430 0%, #04060d 55%, #04060d 100%)",
        }}
      />
      <ClientOnly>
        {() => (
          <SceneBoundary>
            <Suspense fallback={null}>
              <IntegrationScene />
            </Suspense>
          </SceneBoundary>
        )}
      </ClientOnly>
      {/* Readability scrim so foreground copy stays legible over the scene. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 60% at 50% 50%, transparent 40%, rgba(4,6,13,0.55) 100%)",
        }}
      />
    </div>
  );
}
