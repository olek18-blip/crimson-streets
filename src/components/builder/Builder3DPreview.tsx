import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import type { BuilderLayout } from '../../game/builderLayout';

function RoadPreview({ x, z, rotationY }: { x: number; z: number; rotationY: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[2.6, 0.1, 6.2]} />
        <meshStandardMaterial color="#2b3036" />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[0.12, 0.02, 5.1]} />
        <meshStandardMaterial color="#d4b46b" emissive="#d4b46b" emissiveIntensity={0.08} />
      </mesh>
    </group>
  );
}

function BuildingPreview({
  x,
  z,
  width,
  depth,
  height,
}: {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
}) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#4b5563" emissive="#111827" emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0, height + 0.08, 0]}>
        <boxGeometry args={[width * 0.88, 0.16, depth * 0.88]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </group>
  );
}

function PropPreview({
  type,
  x,
  z,
  rotationY,
}: {
  type: BuilderLayout['props'][number]['type'];
  x: number;
  z: number;
  rotationY: number;
}) {
  if (type === 'streetlight') {
    return (
      <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 4, 10]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[0, 4.1, 0]}>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color="#fde68a" emissive="#fde68a" emissiveIntensity={0.6} />
        </mesh>
      </group>
    );
  }

  if (type === 'dumpster') {
    return (
      <mesh position={[x, 0.8, z]} rotation={[0, rotationY, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.6, 1.2]} />
        <meshStandardMaterial color="#355448" />
      </mesh>
    );
  }

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 2.2, 8]} />
        <meshStandardMaterial color="#5b3b22" />
      </mesh>
      <mesh position={[0, 3.1, 0]} castShadow>
        <coneGeometry args={[1.4, 3.4, 8]} />
        <meshStandardMaterial color="#2f6b3b" />
      </mesh>
    </group>
  );
}

function BuilderPreviewScene({ layout }: { layout: BuilderLayout }) {
  const grid = useMemo(() => new THREE.GridHelper(160, 80, '#334155', '#1e293b'), []);

  return (
    <>
      <color attach="background" args={['#071019']} />
      <fog attach="fog" args={['#071019', 90, 220]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[30, 40, 20]} intensity={1.1} castShadow />
      <primitive object={grid} position={[0, 0, 0]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      {layout.roads.map((road) => (
        <RoadPreview key={road.id} {...road} />
      ))}
      {layout.buildings.map((building) => (
        <BuildingPreview key={building.id} {...building} />
      ))}
      {layout.props.map((prop) => (
        <PropPreview key={prop.id} {...prop} />
      ))}

      <OrbitControls enablePan enableZoom enableRotate maxPolarAngle={Math.PI / 2.15} minDistance={28} maxDistance={120} />
    </>
  );
}

export default function Builder3DPreview({ layout }: { layout: BuilderLayout }) {
  return (
    <Canvas
      dpr={[0.7, 1]}
      shadows
      camera={{ position: [42, 36, 42], fov: 46, near: 0.1, far: 400 }}
      gl={{ antialias: false }}
      style={{ background: '#071019' }}
    >
      <BuilderPreviewScene layout={layout} />
    </Canvas>
  );
}

