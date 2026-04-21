import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../game/store';

export default function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const { player } = useGameStore();

  useFrame((state) => {
    if (!groupRef.current) return;

    const motion = player.isRunning ? 1 : 0.45;
    const bob = player.inVehicle ? 0 : Math.sin(state.clock.elapsedTime * 8 * motion) * 0.035;
    const sway = player.inVehicle ? 0 : Math.sin(state.clock.elapsedTime * 5 * motion) * 0.03;

    groupRef.current.position.set(player.position[0], player.position[1] + bob, player.position[2]);
    groupRef.current.rotation.y = player.rotation;
    groupRef.current.rotation.z = player.isRunning ? sway * 0.35 : 0;
  });

  if (player.inVehicle) return null;

  const coatColor = player.weapon === 'rifle' ? '#242b38' : '#2b3550';
  const accentColor = player.isRunning ? '#e05a46' : '#d0a94d';

  return (
    <group ref={groupRef} scale={[1.08, 1.08, 1.08]}>
      <pointLight position={[0, 1.2, 0.8]} color="#ffe2a8" intensity={0.55} distance={4.2} />
      <pointLight position={[0, 1.0, -0.9]} color="#7cc7ff" intensity={0.35} distance={3.4} />

      <mesh position={[0, 0.18, 0.02]} castShadow>
        <boxGeometry args={[0.42, 0.26, 0.24]} />
        <meshStandardMaterial color="#161a24" emissive="#0b0d12" emissiveIntensity={0.12} />
      </mesh>

      <mesh position={[0, 0.62, 0]} castShadow>
        <capsuleGeometry args={[0.24, 0.52, 8, 16]} />
        <meshStandardMaterial color={coatColor} emissive="#0f1420" emissiveIntensity={0.18} metalness={0.08} roughness={0.74} />
      </mesh>

      <mesh position={[0, 0.82, 0.16]} castShadow>
        <boxGeometry args={[0.34, 0.22, 0.08]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.2} />
      </mesh>

      <mesh position={[0, 0.52, -0.16]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.1]} />
        <meshStandardMaterial color="#39445d" emissive="#111827" emissiveIntensity={0.1} />
      </mesh>

      <mesh position={[-0.22, 0.58, 0]} rotation={[0, 0, -0.25]} castShadow>
        <capsuleGeometry args={[0.07, 0.34, 6, 12]} />
        <meshStandardMaterial color="#1d2230" />
      </mesh>
      <mesh position={[0.22, 0.58, 0]} rotation={[0, 0, 0.25]} castShadow>
        <capsuleGeometry args={[0.07, 0.34, 6, 12]} />
        <meshStandardMaterial color="#1d2230" />
      </mesh>

      <mesh position={[-0.1, 0.03, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.46, 6, 12]} />
        <meshStandardMaterial color="#141414" />
      </mesh>
      <mesh position={[0.1, 0.03, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.46, 6, 12]} />
        <meshStandardMaterial color="#141414" />
      </mesh>

      <mesh position={[0, 1.12, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#d8ad7d" emissive="#3a2419" emissiveIntensity={0.06} />
      </mesh>

      <mesh position={[0, 1.22, 0.01]} castShadow>
        <boxGeometry args={[0.34, 0.12, 0.3]} />
        <meshStandardMaterial color="#1d1d1d" />
      </mesh>

      <mesh position={[0, 1.02, 0.16]} castShadow>
        <boxGeometry args={[0.28, 0.08, 0.03]} />
        <meshStandardMaterial color="#121212" />
      </mesh>

      <mesh position={[0, 1.09, 0.18]}>
        <boxGeometry args={[0.16, 0.025, 0.02]} />
        <meshStandardMaterial color="#f2f2f2" emissive="#7a7a7a" emissiveIntensity={0.28} />
      </mesh>

      {player.weapon !== 'fist' && (
        <group position={[0.28, 0.56, -0.22]} rotation={[0.08, 0.12, 0.08]}>
          <mesh castShadow>
            <boxGeometry args={player.weapon === 'rifle' ? [0.08, 0.08, 0.58] : [0.06, 0.06, 0.32]} />
            <meshStandardMaterial color="#353942" metalness={0.15} roughness={0.72} />
          </mesh>
          {player.weapon === 'rifle' && (
            <>
              <mesh position={[0, -0.08, 0.02]} castShadow>
                <boxGeometry args={[0.06, 0.12, 0.12]} />
                <meshStandardMaterial color="#242832" />
              </mesh>
              <mesh position={[0, 0.04, 0.18]} castShadow>
                <boxGeometry args={[0.05, 0.05, 0.16]} />
                <meshStandardMaterial color="#1c1f27" />
              </mesh>
            </>
          )}
        </group>
      )}

      {player.isShooting && player.weapon !== 'fist' && (
        <>
          <pointLight position={[0.32, 0.58, -0.56]} color="#ff6a00" intensity={3.4} distance={5} />
          <mesh position={[0.32, 0.58, -0.58]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial emissive="#ff7b00" color="#ffcf66" />
          </mesh>
        </>
      )}
    </group>
  );
}
