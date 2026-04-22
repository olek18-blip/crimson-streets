import { useMemo } from 'react';
import { Billboard, Text } from '@react-three/drei';
import { getMissionTarget } from '../../game/missionSelectors';
import { useGameStore } from '../../game/store';

export default function MissionBeacon() {
  const player = useGameStore((state) => state.player);
  const activeMission = useGameStore((state) => state.activeMission);
  const missions = useGameStore((state) => state.missions);

  const missionTarget = useMemo(
    () => getMissionTarget({ player, missions, activeMission }),
    [player, missions, activeMission],
  );

  if (!missionTarget?.objective.targetPosition) {
    return null;
  }

  const [x, , z] = missionTarget.objective.targetPosition;
  const accentColor = missionTarget.kind === 'active-objective' ? '#f59e0b' : '#22d3ee';
  const label = missionTarget.kind === 'active-objective' ? 'OBJETIVO' : 'OPERACION';

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 5.2, 16, 1, true]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} transparent opacity={0.22} />
      </mesh>

      <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.9, 32]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.9} transparent opacity={0.9} />
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
            {label}
          </Text>
        </group>
      </Billboard>
    </group>
  );
}
