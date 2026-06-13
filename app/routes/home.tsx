import type { Route } from "./+types/home";
import { brand } from "~/lib/content";
import { useMotionStateListeners } from "~/lib/scroll-store";
import { SceneBackground } from "~/components/three/SceneBackground";
import { Nav } from "~/components/Nav";
import { Hud } from "~/components/Hud";
import { Footer } from "~/components/Footer";
import { Hero } from "~/components/sections/Hero";
import { IntegrationMesh } from "~/components/sections/IntegrationMesh";
import { Systems } from "~/components/sections/Systems";
import { Pipeline } from "~/components/sections/Pipeline";
import { CodeStream } from "~/components/sections/CodeStream";
import { Capabilities } from "~/components/sections/Capabilities";
import { Contact } from "~/components/sections/Contact";

export function meta({}: Route.MetaArgs) {
  const title = `${brand.full} — ${brand.tagline}`;
  const description =
    "Deep, resilient systems integration for commerce: Shopify, ERP, WMS, 3PL, POS and beyond. Scroll through a living 3D integration mesh.";
  return [
    { title },
    { name: "description", content: description },
    { name: "theme-color", content: "#04060d" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

export default function Home() {
  // Six full-height "scenes" feed the HUD phase + camera depth mapping.
  useMotionStateListeners(6);

  return (
    <>
      <SceneBackground />
      <Nav />
      <Hud />

      <main className="relative z-10">
        <Hero />
        <IntegrationMesh />
        <Systems />
        <Pipeline />
        <CodeStream />
        <Capabilities />
        <Contact />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
