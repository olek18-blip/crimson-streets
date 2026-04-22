import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { shallow } from 'zustand/shallow';
import { useGameStore } from '../../game/store';
import { AnimatedPlayerCharacterModel, CombatKnifeModel, GunModel, PistolFireModel } from './AssetLibrary';

const RANGED_WEAPONS = new Set(['pistol', 'rifle']);
const HAND_SOCKET_CANDIDATES = [
  'mixamorigRightHand',
  'RightHand',
  'rightHand',
  'Hand_R',
  'hand_r',
  'hand.R',
  'r_hand',
  'R_Hand',
  'Bip01_R_Hand',
];

function findRightHandSocket(root: THREE.Object3D) {
  for (const name of HAND_SOCKET_CANDIDATES) {
    const found = root.getObjectByName(name);
    if (found) return found;
  }

  // Heuristic fallback: best-effort "right hand" bone.
  let candidate: THREE.Object3D | null = null;
  root.traverse((node) => {
    if (candidate) return;
    if (!(node instanceof THREE.Bone)) return;
    const name = node.name.toLowerCase();
    if (name.includes('hand') && (name.includes('right') || name.includes('_r') || name.endsWith('r') || name.includes('.r'))) {
      candidate = node;
    }
  });
  return candidate;
}

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

function WeaponModel({ weapon }: { weapon: 'knife' | 'pistol' | 'rifle' }) {
  if (weapon === 'knife') return <CombatKnifeModel />;
  if (weapon === 'pistol') return <PistolFireModel />;
  return <GunModel />;
}

export default function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const characterRef = useRef<THREE.Group>(null);
  const weaponRef = useRef<THREE.Group>(null);
  const muzzleLightRef = useRef<THREE.PointLight>(null);
  const muzzleMeshRef = useRef<THREE.Mesh>(null);
  const shotFlashTimerRef = useRef(0);
  const shotPulseLightRef = useRef<THREE.PointLight>(null);
  const shotPulseMeshRef = useRef<THREE.Mesh>(null);
  const shotPulseTimerRef = useRef(0);
  const [weaponSocket, setWeaponSocket] = useState<THREE.Object3D | null>(null);

  const playerRenderState = useGameStore(
    (state) => ({
      inVehicle: state.player.inVehicle,
      weapon: state.player.weapon,
      isShooting: state.player.isShooting,
      animationState: state.player.animationState,
      shotTick: state.shotTick,
      lastShotWeapon: state.lastShotWeapon,
    }),
    shallow,
  );

  const hasWeaponModel = playerRenderState.weapon !== 'fist';
  const hasRangedWeapon = RANGED_WEAPONS.has(playerRenderState.weapon);
  const usingBoneSocket = Boolean(weaponSocket);

  const weaponModel = useMemo(() => {
    if (!hasWeaponModel) return null;
    return (
      <Suspense fallback={<WeaponFallback weapon={playerRenderState.weapon} />}>
        <WeaponModel weapon={playerRenderState.weapon === 'knife' ? 'knife' : playerRenderState.weapon === 'pistol' ? 'pistol' : 'rifle'} />
      </Suspense>
    );
  }, [hasWeaponModel, playerRenderState.weapon]);

  useEffect(() => {
    // Trigger a short muzzle flash on each "registered" shot.
    if (!playerRenderState.lastShotWeapon) return;
    if (!(playerRenderState.lastShotWeapon === 'pistol' || playerRenderState.lastShotWeapon === 'rifle')) return;

    shotFlashTimerRef.current = 0.07;
    if (muzzleLightRef.current) muzzleLightRef.current.visible = true;
    if (muzzleMeshRef.current) muzzleMeshRef.current.visible = true;
  }, [playerRenderState.shotTick, playerRenderState.lastShotWeapon]);

  useEffect(() => {
    if (!playerRenderState.lastShotWeapon) return;
    if (!(playerRenderState.lastShotWeapon === 'pistol' || playerRenderState.lastShotWeapon === 'rifle')) return;
    // Debug-friendly "always visible" shot pulse so the player gets feedback even if the weapon socket is off.
    shotPulseTimerRef.current = 0.12;
    if (shotPulseLightRef.current) shotPulseLightRef.current.visible = true;
    if (shotPulseMeshRef.current) shotPulseMeshRef.current.visible = true;
  }, [playerRenderState.shotTick, playerRenderState.lastShotWeapon]);

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

    if (!weaponSocket && characterRef.current) {
      const socket = findRightHandSocket(characterRef.current);
      if (socket) setWeaponSocket(socket);
    }

    if (weaponRef.current) {
      if (usingBoneSocket) {
        // Tuned for a typical right-hand socket; adjust later if the rig changes.
        if (player.weapon === 'knife') {
          weaponRef.current.position.set(0.055, 0.02, 0.02);
          weaponRef.current.rotation.set(-0.35, Math.PI / 2, 1.15);
          weaponRef.current.scale.setScalar(1);
        } else if (player.weapon === 'rifle') {
          weaponRef.current.position.set(0.07, 0.03, 0.015);
          weaponRef.current.rotation.set(-Math.PI / 2 + 0.14, 0.1, Math.PI);
          weaponRef.current.scale.setScalar(1);
        } else if (player.weapon === 'pistol') {
          weaponRef.current.position.set(0.06, 0.03, 0.012);
          weaponRef.current.rotation.set(-Math.PI / 2 + 0.08, 0.08, Math.PI);
          weaponRef.current.scale.setScalar(1);
        }
      } else {
        // Fallback placement (when no hand socket exists on the model).
        if (player.weapon === 'knife') {
          weaponRef.current.position.set(0.24, 0.88, -0.04);
          weaponRef.current.rotation.set(
            player.animationState === 'shoot' ? -0.48 : -0.12,
            Math.PI / 2,
            player.animationState === 'shoot' ? 0.38 : 0.16,
          );
          weaponRef.current.scale.setScalar(1);
        } else if (player.weapon === 'rifle') {
          weaponRef.current.position.set(0.28, 0.92, -0.12);
          weaponRef.current.rotation.set(player.animationState === 'shoot' ? -0.2 : -0.04, Math.PI, 0);
          weaponRef.current.scale.setScalar(1);
        } else {
          weaponRef.current.position.set(0.24, 0.92, -0.06);
          weaponRef.current.rotation.set(player.animationState === 'shoot' ? -0.12 : 0.02, Math.PI, 0);
          weaponRef.current.scale.setScalar(1);
        }
      }

      if (player.animationState === 'hit') {
        weaponRef.current.rotation.z += 0.22;
      }

      if (player.animationState === 'jump') {
        weaponRef.current.rotation.x += rangedWeapon ? 0.1 : 0.16;
      }
    }

    if (shotFlashTimerRef.current > 0) {
      shotFlashTimerRef.current = Math.max(0, shotFlashTimerRef.current - state.clock.getDelta());
      if (shotFlashTimerRef.current <= 0) {
        if (muzzleLightRef.current) muzzleLightRef.current.visible = false;
        if (muzzleMeshRef.current) muzzleMeshRef.current.visible = false;
      }
    }

    if (shotPulseTimerRef.current > 0) {
      shotPulseTimerRef.current = Math.max(0, shotPulseTimerRef.current - state.clock.getDelta());
      if (shotPulseTimerRef.current <= 0) {
        if (shotPulseLightRef.current) shotPulseLightRef.current.visible = false;
        if (shotPulseMeshRef.current) shotPulseMeshRef.current.visible = false;
      }
    }
  });

  if (playerRenderState.inVehicle) {
    return null;
  }

  const weaponGroup = hasWeaponModel ? (
    <group ref={weaponRef}>
      {/* Keep model transforms at the group level so we can re-parent to a hand socket. */}
      <group rotation={[0, Math.PI, 0]}>{weaponModel}</group>

      {/* Muzzle flash (visibility toggled imperatively via refs). */}
      <pointLight ref={muzzleLightRef} visible={false} position={[0.02, 0.02, -0.34]} color="#ff6a00" intensity={3.2} distance={5} />
      <mesh ref={muzzleMeshRef} visible={false} position={[0.02, 0.02, -0.36]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial emissive="#ff7b00" color="#ffcf66" />
      </mesh>
    </group>
  ) : null;

  return (
    <group ref={groupRef}>
      <pointLight position={[0, 1.6, 0.9]} color="#ffe6ad" intensity={0.9} distance={6.4} />
      <pointLight position={[0, 1.2, -1]} color="#7cc7ff" intensity={0.4} distance={5.2} />

      <group ref={characterRef}>
        <Suspense fallback={<PlayerFallback />}>
          <AnimatedPlayerCharacterModel animationState={playerRenderState.animationState} scale={0.56} rotation={[0, Math.PI, 0]} />
        </Suspense>
      </group>

      <group position={[0.32, 1.08, -0.7]}>
        <pointLight ref={shotPulseLightRef} visible={false} color="#ff6a00" intensity={2.6} distance={6} />
        <mesh ref={shotPulseMeshRef} visible={false}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshStandardMaterial emissive="#ff7b00" color="#ffcf66" />
        </mesh>
      </group>

      {weaponGroup && (weaponSocket ? createPortal(weaponGroup, weaponSocket) : weaponGroup)}
    </group>
  );
}
