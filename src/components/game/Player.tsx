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

  const coatColor = player.weapon === 'rifle' ? '#1b1f27' : '#20263a';
  const accentColor = player.isRunning ? '#d94c3d' : '#b8963a';

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.18, 0.02]} castShadow>
        <boxGeometry args={[0.42, 0.26, 0.24]} />
        <meshStandardMaterial color="#12151d" />
      </mesh>

      <mesh position={[0, 0.62, 0]} castShadow>
        <capsuleGeometry args={[0.24, 0.52, 8, 16]} />
        <meshStandardMaterial color={coatColor} />
      </mesh>

      <mesh position={[0, 0.82, 0.16]} castShadow>
        <boxGeometry args={[0.34, 0.22, 0.08]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      <mesh position={[0, 0.52, -0.16]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.1]} />
        <meshStandardMaterial color="#2f3546" />
      </mesh>

      <mesh position={[-0.22, 0.58, 0]} rotation={[0, 0, -0.25]} castShadow>
        <capsuleGeometry args={[0.07, 0.34, 6, 12]} />
        <meshStandardMaterial color="#181b23" />
      </mesh>
      <mesh position={[0.22, 0.58, 0]} rotation={[0, 0, 0.25]} castShadow>
        <capsuleGeometry args={[0.07, 0.34, 6, 12]} />
        <meshStandardMaterial color="#181b23" />
      </mesh>

      <mesh position={[-0.1, 0.03, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.46, 6, 12]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0.1, 0.03, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.46, 6, 12]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      <mesh position={[0, 1.12, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>

      <mesh position={[0, 1.22, 0.01]} castShadow>
        <boxGeometry args={[0.34, 0.12, 0.3]} />
        <meshStandardMaterial color="#1b1b1b" />
      </mesh>

      <mesh position={[0, 1.02, 0.16]} castShadow>
        <boxGeometry args={[0.28, 0.08, 0.03]} />
        <meshStandardMaterial color="#101010" />
      </mesh>

      <mesh position={[0, 1.09, 0.18]}>
        <boxGeometry args={[0.16, 0.025, 0.02]} />
        <meshStandardMaterial color="#f2f2f2" emissive="#5a5a5a" />
      </mesh>

      {player.weapon !== 'fist' && (
        <group position={[0.28, 0.56, -0.22]} rotation={[0.08, 0.12, 0.08]}>
          <mesh castShadow>
            <boxGeometry args={player.weapon === 'rifle' ? [0.08, 0.08, 0.58] : [0.06, 0.06, 0.32]} />
            <meshStandardMaterial color="#2e3138" />
          </mesh>
          {player.weapon === 'rifle' && (
            <>
              <mesh position={[0, -0.08, 0.02]} castShadow>
                <boxGeometry args={[0.06, 0.12, 0.12]} />
                <meshStandardMaterial color="#20232b" />
              </mesh>
              <mesh position={[0, 0.04, 0.18]} castShadow>
                <boxGeometry args={[0.05, 0.05, 0.16]} />
                <meshStandardMaterial color="#181a1f" />
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
