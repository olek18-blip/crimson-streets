import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { shallow } from 'zustand/shallow';
import { useGameStore } from '../../game/store';
import { AnimatedPlayerCharacterModel, CombatKnifeModel, GunModel } from './AssetLibrary';

const RANGED_WEAPONS = new Set(['pistol', 'rifle']);

function PlayerFallback() {
  return (
    <group>
      <mesh position={[0, 0.18, 0.02]} castShadow>
        <boxGeometry args={[0.42, 0.26, 0.24]} />
        <meshStandardMaterial color="#161a24" emissive="#0b0d12" emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <capsuleGeometry args={[0.24, 0.52, 8, 16]} />
        <meshStandardMaterial color="#2b3550" emissive="#0f1420" emissiveIntensity={0.18} metalness={0.08} roughness={0.74} />
      </mesh>
      <mesh position={[0, 1.12, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#d8ad7d" emissive="#3a2419" emissiveIntensity={0.06} />
      </mesh>
    </group>
  );
}

function WeaponFallback({ weapon }: { weapon: 'fist' | 'knife' | 'pistol' | 'rifle' }) {
  return (
    <mesh castShadow>
      <boxGeometry args={weapon === 'rifle' ? [0.08, 0.08, 0.58] : weapon === 'knife' ? [0.04, 0.02, 0.28] : [0.06, 0.06, 0.32]} />
      <meshStandardMaterial color="#353942" metalness={0.15} roughness={0.72} />
    </mesh>
  );
}

export default function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const characterRef = useRef<THREE.Group>(null);
  const weaponRef = useRef<THREE.Group>(null);
  const playerRenderState = useGameStore(
    (state) => ({
      inVehicle: state.player.inVehicle,
      weapon: state.player.weapon,
      isShooting: state.player.isShooting,
      animationState: state.player.animationState,
    }),
    shallow,
  );

  useFrame((state) => {
    if (!groupRef.current || !characterRef.current) {
      return;
    }

    const player = useGameStore.getState().player;
    const elapsed = state.clock.elapsedTime;
    const runLean = player.animationState === 'run' ? 0.08 : player.animationState === 'walk' ? 0.04 : 0;
    const jumpLift = player.animationState === 'jump' ? Math.max(0, Math.sin(elapsed * 9.5)) * 0.08 : 0;
    const hitRecoil = player.animationState === 'hit' ? Math.sin(elapsed * 22) * 0.08 : 0;
    const deathTilt = player.animationState === 'death' ? -1.2 : 0;
    const rangedWeapon = RANGED_WEAPONS.has(player.weapon);

    groupRef.current.position.set(player.position[0], player.position[1] + jumpLift, player.position[2]);
    groupRef.current.rotation.y = player.rotation;
    groupRef.current.rotation.z = player.animationState === 'death' ? 0.26 : hitRecoil * -0.08;

    characterRef.current.rotation.x = deathTilt - runLean + (player.animationState === 'jump' ? -0.1 : 0);
    characterRef.current.rotation.z = player.animationState === 'run' ? 0.04 : player.animationState === 'hit' ? -0.05 : 0;
    characterRef.current.position.y = player.animationState === 'death' ? 0.08 : 0;

    if (weaponRef.current) {
      if (player.weapon === 'knife') {
        weaponRef.current.position.set(0.24, 0.88, -0.04);
        weaponRef.current.rotation.set(
          player.animationState === 'shoot' ? -0.48 : -0.12,
          Math.PI / 2,
          player.animationState === 'shoot' ? 0.38 : 0.16,
        );
      } else if (player.weapon === 'rifle') {
        weaponRef.current.position.set(0.28, 0.92, -0.12);
        weaponRef.current.rotation.set(player.animationState === 'shoot' ? -0.2 : -0.04, Math.PI, 0);
      } else {
        weaponRef.current.position.set(0.24, 0.92, -0.06);
        weaponRef.current.rotation.set(player.animationState === 'shoot' ? -0.12 : 0.02, Math.PI, 0);
      }

      if (player.animationState === 'hit') {
        weaponRef.current.rotation.z += 0.22;
      }

      if (player.animationState === 'jump') {
        weaponRef.current.rotation.x += rangedWeapon ? 0.1 : 0.16;
      }
    }
  });

  if (playerRenderState.inVehicle) {
    return null;
  }

  const hasWeaponModel = playerRenderState.weapon !== 'fist';
  const hasRangedWeapon = RANGED_WEAPONS.has(playerRenderState.weapon);

  return (
    <group ref={groupRef}>
      <pointLight position={[0, 1.4, 0.8]} color="#ffe2a8" intensity={0.45} distance={4.4} />
      <pointLight position={[0, 1.1, -0.9]} color="#7cc7ff" intensity={0.25} distance={3.6} />

      <group ref={characterRef}>
        <Suspense fallback={<PlayerFallback />}>
          <AnimatedPlayerCharacterModel animationState={playerRenderState.animationState} scale={0.56} rotation={[0, Math.PI, 0]} />
        </Suspense>
      </group>

      {hasWeaponModel && (
        <group ref={weaponRef}>
          <Suspense fallback={<WeaponFallback weapon={playerRenderState.weapon} />}>
            {playerRenderState.weapon === 'knife' ? (
              <CombatKnifeModel scale={0.02} rotation={[0, Math.PI / 2, 0]} />
            ) : (
              <GunModel
                scale={playerRenderState.weapon === 'rifle' ? 0.12 : 0.08}
                rotation={[0, Math.PI, 0]}
                position={[0, playerRenderState.weapon === 'rifle' ? -0.05 : 0, playerRenderState.weapon === 'rifle' ? -0.08 : 0]}
              />
            )}
          </Suspense>
        </group>
      )}

      {playerRenderState.isShooting && hasRangedWeapon && (
        <>
          <pointLight position={[0.32, 0.92, -0.42]} color="#ff6a00" intensity={3.4} distance={5} />
          <mesh position={[0.32, 0.92, -0.44]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial emissive="#ff7b00" color="#ffcf66" />
          </mesh>
        </>
      )}
    </group>
  );
}
