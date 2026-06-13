import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { systems } from "~/lib/content";
import { motionState } from "~/lib/scroll-store";

/** Golden-angle spiral so nodes spread evenly through depth as we fly past. */
const GOLDEN = 2.39996323;

interface Node {
  pos: THREE.Vector3;
  color: THREE.Color;
}

function buildGraph() {
  const core = new THREE.Vector3(0, 0, 3);
  const nodes: Node[] = systems.map((s, i) => {
    const angle = i * GOLDEN;
    const radius = 4.2 + (i % 3) * 1.3;
    return {
      pos: new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(i * 1.7) * 2.2,
        2 - i * 5.6,
      ),
      color: new THREE.Color(s.color),
    };
  });

  // Edges: every system tethered to the core, plus a chain weaving the mesh.
  const edges: { a: THREE.Vector3; b: THREE.Vector3; color: THREE.Color }[] = [];
  nodes.forEach((n) => edges.push({ a: core, b: n.pos, color: n.color }));
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({ a: nodes[i].pos, b: nodes[i + 1].pos, color: nodes[i + 1].color });
  }

  return { core, nodes, edges };
}

export function MeshGraph() {
  const group = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const packetsRef = useRef<THREE.InstancedMesh>(null);

  const { core, nodes, edges } = useMemo(buildGraph, []);

  // Static line geometry for all conduits (additive, glowing).
  const lineGeometry = useMemo(() => {
    const pts: number[] = [];
    const cols: number[] = [];
    edges.forEach((e) => {
      pts.push(e.a.x, e.a.y, e.a.z, e.b.x, e.b.y, e.b.z);
      // Fade conduits from dim core to bright endpoint.
      cols.push(0.12, 0.18, 0.28, e.color.r, e.color.g, e.color.b);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    return geo;
  }, [edges]);

  // One packet rides each edge; phase + speed are randomized per packet.
  const packets = useMemo(
    () =>
      edges.map((e, i) => ({
        edge: e,
        t: Math.random(),
        speed: 0.18 + Math.random() * 0.32,
        offset: i,
      })),
    [edges],
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Whole mesh breathes + responds to scroll and pointer parallax.
    if (group.current) {
      const targetRotY = motionState.progress * Math.PI * 1.4 + motionState.pointerX * 0.25;
      const targetRotX = motionState.pointerY * 0.18 + Math.sin(t * 0.1) * 0.05;
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotY, 2, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetRotX, 2, delta);
    }

    if (coreRef.current) {
      const s = 1 + Math.sin(t * 1.6) * 0.06;
      coreRef.current.scale.setScalar(s);
      coreRef.current.rotation.x += delta * 0.3;
      coreRef.current.rotation.y += delta * 0.22;
    }

    // March packets along their conduits.
    const mesh = packetsRef.current;
    if (mesh) {
      packets.forEach((p, i) => {
        p.t = (p.t + delta * p.speed) % 1;
        dummy.position.lerpVectors(p.edge.a, p.edge.b, p.t);
        const pulse = 0.7 + Math.sin(t * 4 + p.offset) * 0.3;
        dummy.scale.setScalar(0.12 * pulse);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, tmpColor.copy(p.edge.color).multiplyScalar(1.4));
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      {/* Conduits */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Central integration core */}
      <group position={core}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={1.4}
            wireframe
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color="#0b1120" emissive="#a855f7" emissiveIntensity={2} />
        </mesh>
        <pointLight color="#22d3ee" intensity={28} distance={26} decay={2} />
      </group>

      {/* System nodes */}
      {nodes.map((n, i) => (
        <group key={i} position={n.pos}>
          <mesh>
            <icosahedronGeometry args={[0.55, 0]} />
            <meshStandardMaterial
              color={n.color}
              emissive={n.color}
              emissiveIntensity={1.8}
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>
          {/* Halo ring */}
          <mesh rotation={[Math.PI / 2.3, 0, i]}>
            <torusGeometry args={[1.05, 0.018, 8, 48]} />
            <meshBasicMaterial
              color={n.color}
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <pointLight color={n.color} intensity={6} distance={8} decay={2} />
        </group>
      ))}

      {/* Flowing data packets (instanced for cheapness) */}
      <instancedMesh
        ref={packetsRef}
        args={[undefined, undefined, packets.length]}
      >
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
