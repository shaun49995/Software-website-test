import { useEffect, useState, type ReactNode } from "react";

/**
 * Renders children only after hydration. WebGL / `window`-dependent code
 * (the whole 3D scene) must never run during SSR, so we gate it here.
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: () => ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children() : fallback}</>;
}
