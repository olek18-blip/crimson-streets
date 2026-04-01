import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../game/store';

function NPCMesh({ type, isAlive }: { type: string; isAlive: boolean }) {
  const colors = {
    civilian: '#8b7355',
    police: '#1a3a6a',
    gang: '#4a1a1a',
  };
  const bodyColor = colors[type as keyof typeof colors] || '#555';

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
  const { npcs, player, damageNPC, setWantedLevel, takeDamage } = useGameStore();
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;

    // Simple police AI: chase if wanted
    if (player.wantedLevel > 0 && timeRef.current % 2 < delta) {
      npcs.forEach(npc => {
        if (npc.type === 'police' && npc.isAlive) {
          const dx = player.position[0] - npc.position[0];
          const dz = player.position[2] - npc.position[2];
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < 8) {
            takeDamage(2 * player.wantedLevel);
          }
        }
      });
    }

    // Check shooting hits
    if (player.isShooting && player.weapon !== 'fist' && timeRef.current % 0.3 < delta) {
      npcs.forEach(npc => {
        if (!npc.isAlive) return;
        const dx = npc.position[0] - player.position[0];
        const dz = npc.position[2] - player.position[2];
        const dist = Math.sqrt(dx * dx + dz * dz);
        
        // Check if NPC is roughly in front of player
        const angle = Math.atan2(-dx, -dz);
        const angleDiff = Math.abs(angle - player.rotation) % (Math.PI * 2);
        const range = player.weapon === 'rifle' ? 20 : 12;
        
        if (dist < range && (angleDiff < 0.5 || angleDiff > Math.PI * 2 - 0.5)) {
          const damage = player.weapon === 'rifle' ? 35 : 20;
          damageNPC(npc.id, damage);
          if (npc.type === 'civilian') {
            setWantedLevel(player.wantedLevel + 1);
          }
        }
      });
    }
  });

  return (
    <group>
      {npcs.map(npc => (
        <group key={npc.id} position={npc.position} rotation={[0, npc.rotation, 0]}>
          <NPCMesh type={npc.type} isAlive={npc.isAlive} />
        </group>
      ))}
    </group>
  );
}
