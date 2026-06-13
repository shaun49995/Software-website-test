import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motionState } from "~/lib/scroll-store";

/**
 * Dust of "data" streaking toward the camera. Speed scales with how fast the
 * visitor is scrolling, so accelerating down the page feels like accelerating
 * through the system. Particles recycle once they pass behind the camera.
 */
export function WarpStream({ count = 700 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const lastProgress = useRef(0);
  const velocity = useRef(0);

  const { geometry, positions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const a = new THREE.Color("#22d3ee");
    const b = new THREE.Color("#a855f7");
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = -Math.random() * 90;
      const c = a.clone().lerp(b, Math.random());
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { geometry: geo, positions };
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const dp = motionState.progress - lastProgress.current;
    lastProgress.current = motionState.progress;
    // Smooth a base drift + a scroll-driven burst of speed.
    const target = 6 + Math.abs(dp) * 1400;
    velocity.current = THREE.MathUtils.damp(velocity.current, target, 3, delta);

    const camZ = state.camera.position.z;
    const arr = positions;
    const step = velocity.current * delta;
    for (let i = 0; i < count; i++) {
      const zi = i * 3 + 2;
      arr[zi] += step;
      // Recycle particles that drift behind the camera back into the distance.
      if (arr[zi] > camZ + 4) {
        arr[i * 3] = (Math.random() - 0.5) * 26;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
        arr[zi] = camZ - 90 - Math.random() * 20;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.09}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
