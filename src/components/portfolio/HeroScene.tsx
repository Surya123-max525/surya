import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Sphere,
  Torus,
  Icosahedron,
  Points,
  PointMaterial,
} from "@react-three/drei";
import { useMemo, useRef, Suspense } from "react";
import * as THREE from "three";

const GOLD = "#D4AF37";
const GOLD_DEEP = "#B8860B";

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      const r = 6 + Math.random() * 6;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, []);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.03;
      ref.current.rotation.x += d * 0.01;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={GOLD}
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

function GoldCube({
  position,
  scale = 1,
  speed = 1,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s, d) => {
    if (ref.current) {
      ref.current.rotation.x += d * 0.3 * speed;
      ref.current.rotation.y += d * 0.4 * speed;
    }
  });
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={ref} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={1}
          roughness={0.15}
          emissive={GOLD_DEEP}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function WireSphere({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.2;
      ref.current.rotation.x += d * 0.1;
    }
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 2]} />
      <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.5} />
    </mesh>
  );
}

function GoldRing({
  position,
  rotation,
  scale = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.z += d * 0.3;
  });
  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <torusGeometry args={[1, 0.02, 16, 100]} />
      <meshStandardMaterial
        color={GOLD}
        metalness={1}
        roughness={0.2}
        emissive={GOLD}
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

function DistortBlob() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.15;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={ref} args={[1.4, 64, 64]} position={[3.5, -1, -2]}>
        <MeshDistortMaterial
          color={GOLD_DEEP}
          attach="material"
          distort={0.45}
          speed={1.5}
          roughness={0.2}
          metalness={0.9}
        />
      </Sphere>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[10, 10, 10]} intensity={2} color={GOLD} />
      <pointLight position={[-10, -5, -5]} intensity={1} color="#ffcc66" />
      <spotLight position={[0, 8, 4]} angle={0.4} intensity={2} color={GOLD} />

      <ParticleField />
      <DistortBlob />

      <GoldCube position={[-3.5, 1.5, -1]} scale={0.6} speed={0.8} />
      <GoldCube position={[3, 2, -2]} scale={0.4} speed={1.2} />
      <GoldCube position={[-2, -2, -1.5]} scale={0.35} speed={1.5} />

      <WireSphere position={[-4, -1, -3]} scale={1.2} />
      <WireSphere position={[4.5, 1.5, -4]} scale={0.8} />

      <GoldRing position={[0, 0, -2]} rotation={[Math.PI / 3, 0, 0]} scale={2.5} />
      <GoldRing position={[0, 0, -2]} rotation={[Math.PI / 2, Math.PI / 4, 0]} scale={3} />
      <GoldRing position={[0, 0, -2]} rotation={[0, Math.PI / 3, Math.PI / 6]} scale={3.5} />

      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <mesh position={[-4.5, 2, -2]}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.1} />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh position={[4, -2.5, -1]}>
          <tetrahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} wireframe />
        </mesh>
      </Float>
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
