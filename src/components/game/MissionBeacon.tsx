import { useMemo } from 'react';
import { Billboard } from '@react-three/drei';
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

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 4, 16, 1, true]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.55} transparent opacity={0.16} />
      </mesh>

      <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.15, 1.55, 32]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.85} transparent opacity={0.78} />
      </mesh>

      <Billboard position={[0, 4.25, 0]} follow>
        <group>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.45, 0.45]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.95} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <circleGeometry args={[0.11, 18]} />
            <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.45} />
          </mesh>
        </group>
      </Billboard>
    </group>
  );
}
