import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../game/store';

export default function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const { player } = useGameStore();

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.set(player.position[0], player.position[1], player.position[2]);
    groupRef.current.rotation.y = player.rotation;
  });

  if (player.inVehicle) return null;

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.6, 8, 16]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      {/* Gun */}
      {player.weapon !== 'fist' && (
        <mesh position={[0.3, 0.6, -0.3]} castShadow>
          <boxGeometry args={[0.06, 0.06, 0.35]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      )}
      {/* Muzzle flash */}
      {player.isShooting && player.weapon !== 'fist' && (
        <pointLight position={[0.3, 0.6, -0.6]} color="#ff6600" intensity={3} distance={5} />
      )}
    </group>
  );
}
