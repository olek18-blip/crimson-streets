import { Suspense, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../game/store';
import type { NPC } from '../../game/types';
import { CivilianAltCharacterModel, CivilianCharacterModel, GangCharacterModel, PoliceCharacterModel } from './AssetLibrary';

type BehaviorState = 'idle' | 'patrol' | 'flee' | 'chase' | 'attack';

const ATTACK_RANGE = 2.2;
const FLEE_TRIGGER_RANGE = 18;
const POLICE_NOTICE_RANGE = 22;
const GANG_AGGRO_RANGE = 12;
const SHOOT_INTERVAL = 0.28;
const MAX_DELTA = 0.05;
const NPC_SYNC_INTERVAL = 0.25;

function wrapAngle(angle: number) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

function moveTowards(current: [number, number, number], target: [number, number, number], speed: number, dt: number) {
  const dx = target[0] - current[0];
  const dz = target[2] - current[2];
  const distance = Math.sqrt(dx * dx + dz * dz);

  if (distance < 0.001) {
    return { position: current, distance };
  }

  const step = Math.min(distance, speed * dt);
  return {
    position: [current[0] + (dx / distance) * step, current[1], current[2] + (dz / distance) * step] as [number, number, number],
    distance,
  };
}

function getAimDiff(playerRotation: number, playerPos: [number, number, number], npcPos: [number, number, number]) {
  const dx = npcPos[0] - playerPos[0];
  const dz = npcPos[2] - playerPos[2];
  const angle = Math.atan2(-dx, -dz);
  return Math.abs(wrapAngle(angle - playerRotation));
}

function getBehavior(npc: NPC, player: ReturnType<typeof useGameStore.getState>['player'], activeMissionCity: string | null) {
  const dx = player.position[0] - npc.position[0];
  const dz = player.position[2] - npc.position[2];
  const distanceToPlayer = Math.sqrt(dx * dx + dz * dz);
  const violenceNearby = player.isShooting && distanceToPlayer < FLEE_TRIGGER_RANGE;
  const crimeDetected = player.wantedLevel > 0 || violenceNearby;

  if (npc.type === 'civilian') {
    if (crimeDetected && distanceToPlayer < FLEE_TRIGGER_RANGE) {
      return 'flee' as const;
    }
    return distanceToPlayer < 8 ? 'idle' as const : 'patrol' as const;
  }

  if (npc.type === 'police') {
    if (distanceToPlayer < ATTACK_RANGE && crimeDetected) {
      return 'attack' as const;
    }
    if (crimeDetected && distanceToPlayer < POLICE_NOTICE_RANGE) {
      return 'chase' as const;
    }
    return 'patrol' as const;
  }

  if (distanceToPlayer < ATTACK_RANGE && (activeMissionCity === npc.city || violenceNearby)) {
    return 'attack' as const;
  }
  if (distanceToPlayer < GANG_AGGRO_RANGE || activeMissionCity === npc.city || violenceNearby) {
    return 'chase' as const;
  }
  return 'patrol' as const;
}

function NPCFallback({
  color,
  emissive,
  position,
}: {
  color: string;
  emissive?: string;
  position?: [number, number, number];
}) {
  return (
    <mesh position={position ?? [0, 0.9, 0]} castShadow>
      <capsuleGeometry args={[0.21, 0.46, 8, 16]} />
      <meshStandardMaterial color={color} emissive={emissive ?? '#0f1014'} emissiveIntensity={0.12} />
    </mesh>
  );
}

function NPCMesh({ npc, behavior, phase }: { npc: NPC; behavior: BehaviorState; phase: number }) {
  const bob = npc.isAlive ? Math.sin(phase) * 0.025 : 0;
  const lean = behavior === 'chase' || behavior === 'attack' ? 0.08 : behavior === 'flee' ? -0.1 : 0;
  const accentColor = behavior === 'attack' ? '#ff4d4d' : behavior === 'chase' ? '#ff9f43' : behavior === 'flee' ? '#8fd3ff' : '#d9d9d9';

  const civilianVariant = npc.id.length % 2;
  const gangVariant = npc.id.length % 2;

  if (!npc.isAlive) {
    return (
      <group rotation={[Math.PI / 2, 0.1, 0]} position={[0, 0.08, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.2, 0.62, 8, 16]} />
          <meshStandardMaterial color="#3a2a2a" />
        </mesh>
      </group>
    );
  }

  if (npc.type === 'police') {
    return (
      <group position={[0, bob, 0]} rotation={[0, 0, lean]}>
        <Suspense fallback={<NPCFallback color="#183a63" emissive="#0d1725" />}>
          <PoliceCharacterModel scale={0.9} rotation={[0, Math.PI, 0]} />
        </Suspense>

        <mesh position={[0, 1.26, 0.02]} castShadow>
          <boxGeometry args={[0.38, 0.08, 0.24]} />
          <meshStandardMaterial color="#132641" emissive="#09111d" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, 0.84, 0.18]} castShadow>
          <boxGeometry args={[0.32, 0.1, 0.04]} />
          <meshStandardMaterial color="#183a63" emissive="#0d1725" emissiveIntensity={0.16} />
        </mesh>

        {(behavior === 'attack' || behavior === 'chase') && (
          <mesh position={[0, 1.32, 0]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} />
          </mesh>
        )}
      </group>
    );
  }

  if (npc.type === 'civilian') {
    return (
      <group position={[0, bob, 0]} rotation={[0, 0, lean]}>
        {civilianVariant === 0 ? (
          <Suspense fallback={<NPCFallback color="#6a5c88" position={[0, 0.88, 0]} />}>
            <CivilianCharacterModel scale={0.92} rotation={[0, Math.PI, 0]} />
          </Suspense>
        ) : (
          <Suspense fallback={<NPCFallback color="#5f7652" position={[0, 0.88, 0]} />}>
            <CivilianAltCharacterModel scale={0.56} rotation={[0, Math.PI, 0]} />
          </Suspense>
        )}

        {behavior === 'flee' && (
          <mesh position={[0, 1.25, 0]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} />
          </mesh>
        )}
      </group>
    );
  }

  return (
    <group position={[0, bob, 0]} rotation={[0, 0, lean]}>
      {npc.type === 'gang' && <pointLight position={[0, 1.05, 0.18]} color="#ff6b6b" intensity={0.12} distance={1.8} />}
      <Suspense fallback={<NPCFallback color={gangVariant === 0 ? '#4a1818' : '#26222b'} emissive="#160d0d" />}>
        <GangCharacterModel scale={gangVariant === 0 ? 0.9 : 0.86} rotation={[0, Math.PI, 0]} />
      </Suspense>

      {(behavior === 'attack' || behavior === 'chase' || behavior === 'flee') && (
        <mesh position={[0, 1.28, 0]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} />
        </mesh>
      )}
    </group>
  );
}

export default function NPCs() {
  const npcs = useGameStore((state) => state.npcs);
  const updateNPCTransforms = useGameStore((state) => state.updateNPCTransforms);
  const damageNPC = useGameStore((state) => state.damageNPC);
  const setWantedLevel = useGameStore((state) => state.setWantedLevel);
  const takeDamage = useGameStore((state) => state.takeDamage);

  const homePositionsRef = useRef<Record<string, [number, number, number]>>({});
  const npcRefs = useRef<Record<string, THREE.Group | null>>({});
  const simulatedTransformsRef = useRef<Record<string, { position: [number, number, number]; rotation: number }>>({});
  const attackCooldownRef = useRef<Record<string, number>>({});
  const shotCooldownRef = useRef(0);
  const syncAccumulatorRef = useRef(0);
  const worldClockRef = useRef(0);

  useEffect(() => {
    const nextTransforms: Record<string, { position: [number, number, number]; rotation: number }> = {};
    const nextHomes: Record<string, [number, number, number]> = {};

    npcs.forEach((npc) => {
      nextTransforms[npc.id] = simulatedTransformsRef.current[npc.id] ?? {
        position: [...npc.position] as [number, number, number],
        rotation: npc.rotation,
      };
      nextHomes[npc.id] = homePositionsRef.current[npc.id] ?? ([...npc.position] as [number, number, number]);
    });

    simulatedTransformsRef.current = nextTransforms;
    homePositionsRef.current = nextHomes;
  }, [npcs]);

  useFrame((_, delta) => {
    const { player, activeMission, missions } = useGameStore.getState();
    const activeMissionCity = activeMission ? missions.find((mission) => mission.id === activeMission)?.city ?? null : null;
    const dt = Math.min(delta, MAX_DELTA);
    worldClockRef.current += dt;
    shotCooldownRef.current = Math.max(0, shotCooldownRef.current - dt);
    syncAccumulatorRef.current += dt;

    npcs.forEach((npc) => {
      attackCooldownRef.current[npc.id] = Math.max(0, (attackCooldownRef.current[npc.id] ?? 0) - dt);

      const simulatedTransform = simulatedTransformsRef.current[npc.id] ?? {
        position: [...npc.position] as [number, number, number],
        rotation: npc.rotation,
      };
      simulatedTransformsRef.current[npc.id] = simulatedTransform;

      const simulatedNpc = {
        ...npc,
        position: simulatedTransform.position,
        rotation: simulatedTransform.rotation,
      };

      if (!npc.isAlive) {
        const ref = npcRefs.current[npc.id];
        if (ref) {
          ref.position.set(...simulatedTransform.position);
          ref.rotation.set(0, simulatedTransform.rotation, 0);
        }
        return;
      }

      const behavior = getBehavior(simulatedNpc, player, activeMissionCity);
      const home = homePositionsRef.current[npc.id] ?? simulatedTransform.position;
      const toPlayerX = player.position[0] - simulatedTransform.position[0];
      const toPlayerZ = player.position[2] - simulatedTransform.position[2];
      const playerDistance = Math.sqrt(toPlayerX * toPlayerX + toPlayerZ * toPlayerZ);
      let nextPosition = simulatedTransform.position;
      let nextRotation = simulatedTransform.rotation;

      if (behavior === 'patrol') {
        const wanderTarget: [number, number, number] = [
          home[0] + Math.sin(worldClockRef.current * 0.6 + simulatedTransform.position[0]) * 2.2,
          simulatedTransform.position[1],
          home[2] + Math.cos(worldClockRef.current * 0.6 + simulatedTransform.position[2]) * 2.2,
        ];
        const speed = npc.type === 'civilian' ? 1.1 : 1.5;
        const moved = moveTowards(simulatedTransform.position, wanderTarget, speed, dt);
        nextPosition = moved.position;
        nextRotation = Math.atan2(-(wanderTarget[0] - simulatedTransform.position[0]), -(wanderTarget[2] - simulatedTransform.position[2]));
      }

      if (behavior === 'flee') {
        const fleeTarget: [number, number, number] = [
          simulatedTransform.position[0] - toPlayerX * 0.75,
          simulatedTransform.position[1],
          simulatedTransform.position[2] - toPlayerZ * 0.75,
        ];
        const moved = moveTowards(simulatedTransform.position, fleeTarget, 4.8, dt);
        nextPosition = moved.position;
        nextRotation = Math.atan2(-(fleeTarget[0] - simulatedTransform.position[0]), -(fleeTarget[2] - simulatedTransform.position[2]));
      }

      if (behavior === 'chase') {
        const moved = moveTowards(simulatedTransform.position, player.position, npc.type === 'police' ? 4.4 : 4.0, dt);
        nextPosition = moved.position;
        nextRotation = Math.atan2(-toPlayerX, -toPlayerZ);
      }

      if (behavior === 'attack') {
        nextRotation = Math.atan2(-toPlayerX, -toPlayerZ);
        if ((attackCooldownRef.current[npc.id] ?? 0) <= 0 && playerDistance < ATTACK_RANGE + 0.4) {
          takeDamage(npc.type === 'police' ? 8 + player.wantedLevel * 2 : 7);
          attackCooldownRef.current[npc.id] = npc.type === 'police' ? 0.85 : 1.05;
        }
      }

      const movedEnough =
        Math.abs(nextPosition[0] - simulatedTransform.position[0]) > 0.01 ||
        Math.abs(nextPosition[2] - simulatedTransform.position[2]) > 0.01 ||
        Math.abs(wrapAngle(nextRotation - simulatedTransform.rotation)) > 0.04;

      if (movedEnough) {
        simulatedTransform.position = nextPosition;
        simulatedTransform.rotation = nextRotation;
      }

      const ref = npcRefs.current[npc.id];
      if (ref) {
        ref.position.set(...simulatedTransform.position);
        ref.rotation.set(0, simulatedTransform.rotation, 0);
      }
    });

    if (syncAccumulatorRef.current >= NPC_SYNC_INTERVAL) {
      syncAccumulatorRef.current = 0;
      updateNPCTransforms(
        npcs.map((npc) => ({
          id: npc.id,
          position: simulatedTransformsRef.current[npc.id]?.position ?? npc.position,
          rotation: simulatedTransformsRef.current[npc.id]?.rotation ?? npc.rotation,
        })),
      );
    }

    if (player.isShooting && player.weapon !== 'fist' && shotCooldownRef.current <= 0) {
      let wantedIncrease = 0;
      shotCooldownRef.current = player.weapon === 'knife' ? 0.42 : SHOOT_INTERVAL;

      npcs.forEach((npc) => {
        if (!npc.isAlive) {
          return;
        }

        const simulatedTransform = simulatedTransformsRef.current[npc.id] ?? {
          position: npc.position,
          rotation: npc.rotation,
        };
        const dx = simulatedTransform.position[0] - player.position[0];
        const dz = simulatedTransform.position[2] - player.position[2];
        const distance = Math.sqrt(dx * dx + dz * dz);
        const range = player.weapon === 'rifle' ? 20 : player.weapon === 'knife' ? 2.4 : 12;
        const aimDiff = getAimDiff(player.rotation, player.position, simulatedTransform.position);
        const withinStrikeCone = player.weapon === 'knife' ? aimDiff < 1.25 : aimDiff < 0.42;

        if (distance < range && withinStrikeCone) {
          const damage = player.weapon === 'rifle' ? 35 : player.weapon === 'knife' ? 22 : 20;
          damageNPC(npc.id, damage);

          if (npc.type === 'civilian') {
            wantedIncrease = Math.max(wantedIncrease, 1);
          } else if (npc.type === 'gang') {
            wantedIncrease = Math.max(wantedIncrease, 1);
          } else if (npc.type === 'police') {
            wantedIncrease = Math.max(wantedIncrease, 2);
          }
        }
      });

      if (wantedIncrease > 0) {
        setWantedLevel(player.wantedLevel + wantedIncrease);
      }
    }
  });

  return (
    <group>
      {npcs.map((npc, index) => {
        const player = useGameStore.getState().player;
        const activeMission = useGameStore.getState().activeMission;
        const missions = useGameStore.getState().missions;
        const activeMissionCity = activeMission ? missions.find((mission) => mission.id === activeMission)?.city ?? null : null;
        const simulatedTransform = simulatedTransformsRef.current[npc.id];
        const simulatedNpc = simulatedTransform
          ? { ...npc, position: simulatedTransform.position, rotation: simulatedTransform.rotation }
          : npc;
        const behavior = npc.isAlive ? getBehavior(simulatedNpc, player, activeMissionCity) : 'idle';
        const phase = worldClockRef.current * (behavior === 'flee' ? 8 : behavior === 'chase' ? 7 : 4) + index * 0.8;

        return (
          <group
            key={npc.id}
            ref={(element) => {
              npcRefs.current[npc.id] = element;
            }}
            position={simulatedTransform?.position ?? npc.position}
            rotation={[0, simulatedTransform?.rotation ?? npc.rotation, 0]}
          >
            <NPCMesh npc={npc} behavior={behavior} phase={phase} />
          </group>
        );
      })}
    </group>
  );
}
