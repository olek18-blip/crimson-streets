import { useMemo } from 'react';
import { Billboard, Text } from '@react-three/drei';
import { useGameStore } from '../../game/store';

export default function MissionBeacon() {
  const activeMission = useGameStore((state) => state.activeMission);
  const missions = useGameStore((state) => state.missions);

  const objective = useMemo(() => {
    const mission = missions.find((item) => item.id === activeMission);
    return mission?.objectives.find((item) => !item.completed && item.targetPosition) ?? null;
  }, [missions, activeMission]);

  if (!objective?.targetPosition) {
    return null;
  }

  const [x, , z] = objective.targetPosition;

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 5.2, 16, 1, true]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.6} transparent opacity={0.22} />
      </mesh>

      <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.9, 32]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.9} transparent opacity={0.9} />
      </mesh>

      <Billboard position={[0, 5.4, 0]} follow>
        <group>
          <mesh>
            <planeGeometry args={[4.2, 0.95]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={0.82} />
          </mesh>
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.34}
            color="#f8fafc"
            anchorX="center"
            anchorY="middle"
            maxWidth={3.6}
          >
            OBJETIVO
          </Text>
        </group>
      </Billboard>
    </group>
  );
}
