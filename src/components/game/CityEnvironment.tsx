import * as THREE from 'three';
import { useGameStore } from '../../game/store';

function Building({ position, size, color }: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={[position[0], size[1] / 2 + position[1], position[2]]} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Road({ start, end, width = 4 }: {
  start: [number, number]; end: [number, number]; width?: number;
}) {
  const dx = end[0] - start[0];
  const dz = end[1] - start[1];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  const cx = (start[0] + end[0]) / 2;
  const cz = (start[1] + end[1]) / 2;

  return (
    <mesh position={[cx, 0.02, cz]} rotation={[0, angle, 0]} receiveShadow>
      <boxGeometry args={[width, 0.05, length]} />
      <meshStandardMaterial color="#2a2a2a" />
    </mesh>
  );
}

function StreetLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 4]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0.5, 3.8, 0]}>
        <boxGeometry args={[1, 0.1, 0.1]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <pointLight position={[1, 3.5, 0]} color="#ffcc66" intensity={2} distance={12} castShadow />
    </group>
  );
}

export default function CityEnvironment() {
  const buildings = [
    // Downtown cluster
    { pos: [-8, 0, -8] as [number, number, number], size: [5, 12, 5] as [number, number, number], color: '#3a3a4a' },
    { pos: [-8, 0, -2] as [number, number, number], size: [4, 8, 4] as [number, number, number], color: '#4a4a5a' },
    { pos: [-14, 0, -8] as [number, number, number], size: [4, 15, 6] as [number, number, number], color: '#2d2d3d' },
    { pos: [-14, 0, 0] as [number, number, number], size: [3, 6, 5] as [number, number, number], color: '#5a4a3a' },
    // East side
    { pos: [8, 0, -10] as [number, number, number], size: [6, 10, 4] as [number, number, number], color: '#4a3a3a' },
    { pos: [14, 0, -10] as [number, number, number], size: [4, 7, 6] as [number, number, number], color: '#3a4a4a' },
    { pos: [8, 0, -18] as [number, number, number], size: [5, 14, 5] as [number, number, number], color: '#2a3a4a' },
    // South commercial
    { pos: [-5, 0, 12] as [number, number, number], size: [8, 4, 6] as [number, number, number], color: '#5a5a4a' },
    { pos: [5, 0, 15] as [number, number, number], size: [6, 5, 4] as [number, number, number], color: '#4a4a3a' },
    { pos: [-5, 0, 22] as [number, number, number], size: [10, 3, 5] as [number, number, number], color: '#6a5a4a' },
    // Warehouse district (mission area)
    { pos: [18, 0, 12] as [number, number, number], size: [8, 4, 6] as [number, number, number], color: '#3d3025' },
    { pos: [25, 0, 18] as [number, number, number], size: [6, 3, 8] as [number, number, number], color: '#352a20' },
    { pos: [18, 0, 22] as [number, number, number], size: [5, 5, 5] as [number, number, number], color: '#403020' },
    // North area
    { pos: [0, 0, -25] as [number, number, number], size: [6, 9, 4] as [number, number, number], color: '#3a3a5a' },
    { pos: [-10, 0, -20] as [number, number, number], size: [5, 11, 5] as [number, number, number], color: '#2a2a4a' },
    { pos: [10, 0, -25] as [number, number, number], size: [4, 6, 6] as [number, number, number], color: '#4a3a4a' },
  ];

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#1a3a1a" />
      </mesh>

      {/* Buildings */}
      {buildings.map((b, i) => (
        <Building key={i} position={b.pos} size={b.size} color={b.color} />
      ))}

      {/* Roads */}
      <Road start={[0, -50]} end={[0, 50]} width={5} />
      <Road start={[-50, 0]} end={[50, 0]} width={5} />
      <Road start={[-50, -15]} end={[50, -15]} width={4} />
      <Road start={[-50, 15]} end={[50, 15]} width={4} />
      <Road start={[-20, -50]} end={[-20, 50]} width={4} />
      <Road start={[20, -50]} end={[20, 50]} width={4} />

      {/* Street lights */}
      <StreetLight position={[3, 0, 0]} />
      <StreetLight position={[-3, 0, 10]} />
      <StreetLight position={[3, 0, -10]} />
      <StreetLight position={[3, 0, 20]} />
      <StreetLight position={[-3, 0, -20]} />
      <StreetLight position={[10, 0, 3]} />
      <StreetLight position={[-10, 0, 3]} />
      <StreetLight position={[20, 0, 3]} />

      {/* Mission marker glow */}
      <mesh position={[20, 0.1, 15]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.5} transparent opacity={0.4} />
      </mesh>
      <mesh position={[20, 3, 15]}>
        <cylinderGeometry args={[0.1, 0.1, 6, 8]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={1} transparent opacity={0.3} />
      </mesh>

      {/* Water surrounding */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color="#0a2a4a" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}
