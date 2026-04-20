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

  if (npc.type === 'civilian') {
    if (violenceNearby || (player.wantedLevel > 0 && distanceToPlayer < FLEE_TRIGGER_RANGE)) {
      return 'flee' as const;
    }
    return distanceToPlayer < 8 ? 'idle' as const : 'patrol' as const;
  }

  if (npc.type === 'police') {
    if (distanceToPlayer < ATTACK_RANGE && player.wantedLevel > 0) {
      return 'attack' as const;
    }
    if (player.wantedLevel > 0 || violenceNearby || distanceToPlayer < POLICE_NOTICE_RANGE) {
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

function NPCMesh({ type, isAlive, behavior }: { type: string; isAlive: boolean; behavior: BehaviorState }) {
  const colors = {
    civilian: '#8b7355',
    police: '#1a3a6a',
    gang: '#4a1a1a',
  };

  const bodyColor = colors[type as keyof typeof colors] || '#555';
  const accentColor = behavior === 'attack' ? '#ff4d4d' : behavior === 'chase' ? '#ff9f43' : '#ffffff';

  if (!isAlive) {
    return (
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.2, 0.6, 8, 16]} />
        <meshStandardMaterial color="#3a2a2a" />
      </mesh>
    );
  }

  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.5, 8, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      {(behavior === 'attack' || behavior === 'chase') && (
        <mesh position={[0, 1.35, 0]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshStandardMaterial emissive={accentColor} color={accentColor} />
        </mesh>
      )}
      {type === 'police' && (
        <mesh position={[0, 1.18, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 0.08, 8]} />
          <meshStandardMaterial color="#1a2a4a" />
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
      let speed = 0;

      if (behavior === 'patrol') {
        const wanderTarget: [number, number, number] = [
          home[0] + Math.sin(worldClockRef.current * 0.6 + npc.position[0]) * 2.2,
          npc.position[1],
          home[2] + Math.cos(worldClockRef.current * 0.6 + npc.position[2]) * 2.2,
        ];
        speed = npc.type === 'civilian' ? 1.1 : 1.5;
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
      {npcs.map((npc) => {
        const behavior = npc.isAlive ? getBehavior(npc, player, activeMissionCity) : 'idle';
        return (
          <group key={npc.id} position={npc.position} rotation={[0, npc.rotation, 0]}>
            <NPCMesh type={npc.type} isAlive={npc.isAlive} behavior={behavior} />
          </group>
        );
      })}
    </group>
  );
}
