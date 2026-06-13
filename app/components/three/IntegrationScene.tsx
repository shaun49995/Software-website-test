import { Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { motionState } from "~/lib/scroll-store";
import { lerp } from "~/lib/utils";
import { Starfield } from "./Starfield";
import { WarpStream } from "./WarpStream";
import { MeshGraph } from "./MeshGraph";

/**
 * Dollies the camera forward through the mesh as the page scrolls, with gentle
 * pointer/gyro parallax. Damped so it always feels weighty, never snappy.
 */
function CameraRig() {
  const { camera } = useThree();
  useFrame((_, delta) => {
    const targetZ = lerp(15, -44, motionState.progress);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.4, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, motionState.pointerX * 1.6, 2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, -motionState.pointerY * 1.1, 2, delta);
    camera.lookAt(camera.position.x * 0.3, camera.position.y * 0.3, camera.position.z - 12);
  });
  return null;
}

export function IntegrationScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 62, near: 0.1, far: 200 }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: true,
      }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.FogExp2("#04060d", 0.018);
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 8, 6]} intensity={0.6} color="#bfe9ff" />

      <Suspense fallback={null}>
        <Starfield />
        <WarpStream />
        <MeshGraph />
      </Suspense>

      <CameraRig />

      <EffectComposer>
        <Bloom
          intensity={1.25}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.5}
          mipmapBlur
          radius={0.7}
        />
        <Vignette eskil={false} offset={0.25} darkness={0.95} />
      </EffectComposer>
    </Canvas>
  );
}
