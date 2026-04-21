import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../game/store';

function VehicleMesh({ type, color, isPlayerVehicle }: { type: 'car' | 'motorcycle'; color: string; isPlayerVehicle: boolean }) {
  if (type === 'motorcycle') {
    return (
      <group>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 1.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.1, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0, 0.1, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.6, 0.5, 3.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.7, -0.2]} castShadow>
        <boxGeometry args={[1.4, 0.4, 1.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 0.72, 0.6]}>
        <boxGeometry args={[1.3, 0.35, 0.05]} />
        <meshStandardMaterial color="#4488aa" transparent opacity={0.6} />
      </mesh>
      {/* Wheels */}
      {[[-0.8, 0.15, 1.1], [0.8, 0.15, 1.1], [-0.8, 0.15, -1.1], [0.8, 0.15, -1.1]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.15, 12]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
      {/* Headlights */}
      {isPlayerVehicle && (
        <>
          <pointLight position={[0.5, 0.4, 1.8]} color="#ffffcc" intensity={2} distance={15} />
          <pointLight position={[-0.5, 0.4, 1.8]} color="#ffffcc" intensity={2} distance={15} />
        </>
      )}
    </group>
  );
}

export default function Vehicles() {
  const vehicles = useGameStore((state) => state.vehicles);
  const currentVehicle = useGameStore((state) => state.player.currentVehicle);
  const refs = useRef<Record<string, THREE.Group | null>>({});

  useFrame(() => {
    const player = useGameStore.getState().player;
    if (player.inVehicle && player.currentVehicle) {
      const ref = refs.current[player.currentVehicle];
      if (ref) {
        ref.position.set(...player.position);
        ref.rotation.y = player.rotation;
      }
    }
  });

  return (
    <group>
      {vehicles.map(v => {
        const isPlayerVehicle = currentVehicle === v.id;
        const pos = v.position;
        const rot = v.rotation;
        
        return (
          <group
            key={v.id}
            ref={el => { refs.current[v.id] = el; }}
            position={pos}
            rotation={[0, rot, 0]}
          >
            <VehicleMesh type={v.type} color={v.color} isPlayerVehicle={isPlayerVehicle} />
          </group>
        );
      })}
    </group>
  );
}
