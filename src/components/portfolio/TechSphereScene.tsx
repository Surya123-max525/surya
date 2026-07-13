import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Icosahedron } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

const GOLD = "#00dfb2";

function TechSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.25;
      ref.current.rotation.x += d * 0.1;
    }
  });
  return (
    <group>
      <Icosahedron ref={ref} args={[1.6, 2]}>
        <meshStandardMaterial color={GOLD} wireframe transparent opacity={0.7} />
      </Icosahedron>
      <mesh>
        <sphereGeometry args={[1.55, 32, 32]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={1}
          roughness={0.3}
          emissive={GOLD}
          emissiveIntensity={0.05}
        />
      </mesh>
    </group>
  );
}

export default function TechSphereScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 50 }} dpr={[1, 2]} gl={{ alpha: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 3, 3]} intensity={2} color={GOLD} />
        <pointLight position={[-3, -3, -3]} intensity={1} color="#00b4d8" />
        <TechSphere />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Suspense>
    </Canvas>
  );
}
