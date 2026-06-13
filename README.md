# CONDUIT — Integration Engineering Experience

An interactive, mobile-first **3D experience website** for a software
engineering company that builds deep ecommerce & systems integrations
(Shopify, ERP, WMS, 3PL, POS, marketplaces, payments).

Scrolling the page flies the camera **through a living integration mesh**: each
glowing node is a system, the lines between them are data conduits, and the
sparks travelling along them are events (orders, stock changes, fulfilments).
It's designed to feel like exploring the lower-level layer that connects
systems together.

## Stack

- **React Router v7** (framework mode, SSR) + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **shadcn-style** UI primitives (`Button`, `Card`, `Badge`) — no runtime CLI
- **three.js** + **@react-three/fiber** + **@react-three/drei**
- **@react-three/postprocessing** (Bloom + Vignette)
- **motion** (Framer Motion) for scroll reveals

## Experience architecture

- A single fixed, full-viewport WebGL canvas (`SceneBackground`) sits behind the
  page. All content scrolls over it.
- A render-free store (`app/lib/scroll-store.ts`) feeds scroll progress + pointer
  / device-orientation into the scene each frame — no React re-renders in the
  animation loop.
- The camera dollies forward through depth as you scroll; a HUD (`Hud`) shows
  live "telemetry" and scroll depth.
- The 3D scene is **code-split + client-only** with a WebGL error boundary, so
  the page paints instantly, works with SSR, and degrades gracefully to a CSS
  backdrop on unsupported devices.

## Editing content

All copy, brand, systems, pipeline steps, stats and code samples live in
[`app/lib/content.ts`](app/lib/content.ts). Change the company name, email,
systems list, etc. there — components read from it.

## Development

```bash
npm install
npm run dev        # http://localhost:5173
```

## Production

```bash
npm run build
npm run start      # serves build/ on http://localhost:3000
npm run typecheck  # react-router typegen && tsc
```

## Project layout

```
app/
  lib/            content config, scroll store, utils
  components/
    ui/           shadcn-style primitives
    three/        WebGL scene (Starfield, WarpStream, MeshGraph, camera rig)
    sections/     Hero, IntegrationMesh, Systems, Pipeline, CodeStream, …
  routes/home.tsx page assembly
  root.tsx        document shell + fonts
```
