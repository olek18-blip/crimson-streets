import { useEffect, useCallback } from 'react';
import { useGameStore } from '../../game/store';

export function useMissionSystem() {
  const { player, missions, activeMission, startMission, completeMissionObjective, completeMission, npcs } = useGameStore();
  
  useEffect(() => {
    if (!activeMission) {
      // Check if player is near a mission start
      const available = missions.find(m => m.status === 'available');
      if (available && available.objectives[0]?.targetPosition) {
        const target = available.objectives[0].targetPosition;
        const dx = player.position[0] - target[0];
        const dz = player.position[2] - target[2];
        if (Math.sqrt(dx * dx + dz * dz) < 5) {
          startMission(available.id);
        }
      }
      return;
    }

    const mission = missions.find(m => m.id === activeMission);
    if (!mission) return;

    // Objective 1: reach warehouse
    if (!mission.objectives[0].completed) {
      const target = mission.objectives[0].targetPosition!;
      const dx = player.position[0] - target[0];
      const dz = player.position[2] - target[2];
      if (Math.sqrt(dx * dx + dz * dz) < 5) {
        completeMissionObjective(mission.id, 'obj1');
      }
    }

    // Objective 2: eliminate gang members
    if (mission.objectives[0].completed && !mission.objectives[1].completed) {
      const gangAlive = npcs.filter(n => n.type === 'gang' && n.isAlive);
      if (gangAlive.length === 0) {
        completeMissionObjective(mission.id, 'obj2');
      }
    }

    // Objective 3: collect evidence
    if (mission.objectives[1].completed && !mission.objectives[2].completed) {
      const target = mission.objectives[2].targetPosition!;
      const dx = player.position[0] - target[0];
      const dz = player.position[2] - target[2];
      if (Math.sqrt(dx * dx + dz * dz) < 3) {
        completeMissionObjective(mission.id, 'obj3');
      }
    }

    // All complete
    if (mission.objectives.every(o => o.completed)) {
      completeMission(mission.id);
    }
  }, [player.position, npcs, activeMission, missions]);
}
