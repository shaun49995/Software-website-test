import { Component, type ReactNode } from "react";

/**
 * If WebGL fails to initialize (unsupported device, lost context, blocked
 * driver), we silently fall back to the static CSS backdrop rather than
 * crashing the whole page.
 */
export class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) console.warn("WebGL scene disabled:", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
