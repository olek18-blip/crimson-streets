import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../game/store';
import type { NPC } from '../../game/types';

type BehaviorState = 'idle' | 'patrol' | 'flee' | 'chase' | 'attack';

const ATTACK_RANGE = 2.2;
const FLEE_TRIGGER_RANGE = 18;
const POLICE_NOTICE_RANGE = 22;
const GANG_AGGRO_RANGE = 12;
const SHOOT_INTERVAL = 0.28;
const MAX_DELTA = 0.05;

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

function NPCMesh({ npc, behavior, phase }: { npc: NPC; behavior: BehaviorState; phase: number }) {
  const bob = npc.isAlive ? Math.sin(phase) * 0.025 : 0;
  const lean = behavior === 'chase' || behavior === 'attack' ? 0.08 : behavior === 'flee' ? -0.1 : 0;
  const accentColor = behavior === 'attack' ? '#ff4d4d' : behavior === 'chase' ? '#ff9f43' : behavior === 'flee' ? '#8fd3ff' : '#d9d9d9';

  const civilianVariant = npc.id.length % 3;
  const gangVariant = npc.id.length % 2;

  const torsoColor =
    npc.type === 'police' ? '#183a63' : npc.type === 'gang' ? (gangVariant === 0 ? '#3a1414' : '#2b1f38') : civilianVariant === 0 ? '#8d7358' : civilianVariant === 1 ? '#6b7d5e' : '#6f5d88';

  const jacketColor =
    npc.type === 'police' ? '#0f2037' : npc.type === 'gang' ? (gangVariant === 0 ? '#1f1f1f' : '#401818') : civilianVariant === 0 ? '#5a4f43' : civilianVariant === 1 ? '#415244' : '#4f4269';

  const pantsColor = npc.type === 'police' ? '#101827' : npc.type === 'gang' ? '#151515' : '#2b2b2b';

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

  return (
    <group position={[0, bob, 0]} rotation={[0, 0, lean]}>
      <mesh position={[0, 0.16, 0.02]} castShadow>
        <boxGeometry args={[0.36, 0.24, 0.22]} />
        <meshStandardMaterial color={pantsColor} />
      </mesh>

      <mesh position={[0, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.21, 0.46, 8, 16]} />
        <meshStandardMaterial color={jacketColor} />
      </mesh>

      <mesh position={[0, 0.78, 0.14]} castShadow>
        <boxGeometry args={[0.28, 0.18, 0.06]} />
        <meshStandardMaterial color={torsoColor} />
      </mesh>

      <mesh position={[-0.2, 0.56, 0]} rotation={[0, 0, -0.22]} castShadow>
        <capsuleGeometry args={[0.06, 0.28, 6, 12]} />
        <meshStandardMaterial color={jacketColor} />
      </mesh>
      <mesh position={[0.2, 0.56, 0]} rotation={[0, 0, 0.22]} castShadow>
        <capsuleGeometry args={[0.06, 0.28, 6, 12]} />
        <meshStandardMaterial color={jacketColor} />
      </mesh>

      <mesh position={[-0.08, 0.02, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.42, 6, 12]} />
        <meshStandardMaterial color={pantsColor} />
      </mesh>
      <mesh position={[0.08, 0.02, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.42, 6, 12]} />
        <meshStandardMaterial color={pantsColor} />
      </mesh>

      <mesh position={[0, 1.02, 0]} castShadow>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>

      <mesh position={[0, 0.97, 0.14]} castShadow>
        <boxGeometry args={[0.2, 0.06, 0.03]} />
        <meshStandardMaterial color="#151515" />
      </mesh>

      {npc.type === 'police' && (
        <>
          <mesh position={[0, 1.13, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.16, 0.08, 8]} />
            <meshStandardMaterial color="#132641" />
          </mesh>
          <mesh position={[0, 0.66, -0.16]} castShadow>
            <boxGeometry args={[0.28, 0.24, 0.1]} />
            <meshStandardMaterial color="#15212f" />
          </mesh>
        </>
      )}

      {npc.type === 'gang' && (
        <>
          <mesh position={[0, 1.13, 0]} castShadow>
            <boxGeometry args={[0.26, 0.08, 0.24]} />
            <meshStandardMaterial color={gangVariant === 0 ? '#111111' : '#471515'} />
          </mesh>
          <mesh position={[0, 0.88, 0.18]} castShadow>
            <torusGeometry args={[0.07, 0.012, 8, 16]} />
            <meshStandardMaterial color="#b59652" emissive="#4a3411" />
          </mesh>
        </>
      )}

      {npc.type === 'civilian' && civilianVariant === 1 && (
        <mesh position={[0, 0.68, -0.16]} castShadow>
          <boxGeometry args={[0.24, 0.12, 0.08]} />
          <meshStandardMaterial color="#6a4f2f" />
        </mesh>
      )}

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
  const player = useGameStore((state) => state.player);
  const activeMission = useGameStore((state) => state.activeMission);
  const missions = useGameStore((state) => state.missions);
  const updateNPCTransform = useGameStore((state) => state.updateNPCTransform);
  const damageNPC = useGameStore((state) => state.damageNPC);
  const setWantedLevel = useGameStore((state) => state.setWantedLevel);
  const takeDamage = useGameStore((state) => state.takeDamage);

  const homePositionsRef = useRef<Record<string, [number, number, number]>>({});
  const attackCooldownRef = useRef<Record<string, number>>({});
  const shotCooldownRef = useRef(0);
  const worldClockRef = useRef(0);

  useMemo(() => {
    npcs.forEach((npc) => {
      if (!homePositionsRef.current[npc.id]) {
        homePositionsRef.current[npc.id] = [...npc.position] as [number, number, number];
      }
    });
  }, [npcs]);

  const activeMissionCity = activeMission ? missions.find((mission) => mission.id === activeMission)?.city ?? null : null;

  useFrame((_, delta) => {
    const dt = Math.min(delta, MAX_DELTA);
    worldClockRef.current += dt;
    shotCooldownRef.current = Math.max(0, shotCooldownRef.current - dt);

    npcs.forEach((npc) => {
      attackCooldownRef.current[npc.id] = Math.max(0, (attackCooldownRef.current[npc.id] ?? 0) - dt);

      if (!npc.isAlive) {
        return;
      }

      const behavior = getBehavior(npc, player, activeMissionCity);
      const home = homePositionsRef.current[npc.id] ?? npc.position;
      const toPlayerX = player.position[0] - npc.position[0];
      const toPlayerZ = player.position[2] - npc.position[2];
      const playerDistance = Math.sqrt(toPlayerX * toPlayerX + toPlayerZ * toPlayerZ);
      let nextPosition = npc.position;
      let nextRotation = npc.rotation;

      if (behavior === 'patrol') {
        const wanderTarget: [number, number, number] = [
          home[0] + Math.sin(worldClockRef.current * 0.6 + npc.position[0]) * 2.2,
          npc.position[1],
          home[2] + Math.cos(worldClockRef.current * 0.6 + npc.position[2]) * 2.2,
        ];
        const speed = npc.type === 'civilian' ? 1.1 : 1.5;
        const moved = moveTowards(npc.position, wanderTarget, speed, dt);
        nextPosition = moved.position;
        nextRotation = Math.atan2(-(wanderTarget[0] - npc.position[0]), -(wanderTarget[2] - npc.position[2]));
      }

      if (behavior === 'flee') {
        const fleeTarget: [number, number, number] = [
          npc.position[0] - toPlayerX * 0.75,
          npc.position[1],
          npc.position[2] - toPlayerZ * 0.75,
        ];
        const moved = moveTowards(npc.position, fleeTarget, 4.8, dt);
        nextPosition = moved.position;
        nextRotation = Math.atan2(-(fleeTarget[0] - npc.position[0]), -(fleeTarget[2] - npc.position[2]));
      }

      if (behavior === 'chase') {
        const moved = moveTowards(npc.position, player.position, npc.type === 'police' ? 4.4 : 4.0, dt);
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
        Math.abs(nextPosition[0] - npc.position[0]) > 0.01 ||
        Math.abs(nextPosition[2] - npc.position[2]) > 0.01 ||
        Math.abs(wrapAngle(nextRotation - npc.rotation)) > 0.04;

      if (movedEnough) {
        updateNPCTransform(npc.id, nextPosition, nextRotation);
      }
    });

    if (player.isShooting && player.weapon !== 'fist' && shotCooldownRef.current <= 0) {
      let wantedIncrease = 0;
      shotCooldownRef.current = SHOOT_INTERVAL;

      npcs.forEach((npc) => {
        if (!npc.isAlive) {
          return;
        }

        const dx = npc.position[0] - player.position[0];
        const dz = npc.position[2] - player.position[2];
        const distance = Math.sqrt(dx * dx + dz * dz);
        const range = player.weapon === 'rifle' ? 20 : 12;
        const aimDiff = getAimDiff(player.rotation, player.position, npc.position);

        if (distance < range && aimDiff < 0.42) {
          const damage = player.weapon === 'rifle' ? 35 : 20;
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
        const behavior = npc.isAlive ? getBehavior(npc, player, activeMissionCity) : 'idle';
        const phase = worldClockRef.current * (behavior === 'flee' ? 8 : behavior === 'chase' ? 7 : 4) + index * 0.8;

        return (
          <group key={npc.id} position={npc.position} rotation={[0, npc.rotation, 0]}>
            <NPCMesh npc={npc} behavior={behavior} phase={phase} />
          </group>
        );
      })}
    </group>
  );
}
