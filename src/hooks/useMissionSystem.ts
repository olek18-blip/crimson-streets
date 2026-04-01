import { useEffect } from 'react';
import { useGameStore } from '../game/store';

export function useMissionSystem() {
  const { player, missions, activeMission, startMission, completeMissionObjective, completeMission, npcs } = useGameStore();
  
  useEffect(() => {
    if (!activeMission) {
      // Check if player is near any mission start
      for (const m of missions) {
        if (m.status !== 'available') continue;
        const firstObj = m.objectives[0];
        if (!firstObj?.targetPosition) continue;
        const dx = player.position[0] - firstObj.targetPosition[0];
        const dz = player.position[2] - firstObj.targetPosition[2];
        if (Math.sqrt(dx * dx + dz * dz) < 5) {
          startMission(m.id);
          break;
        }
      }
      return;
    }

    const mission = missions.find(m => m.id === activeMission);
    if (!mission) return;

    // Process objectives sequentially
    for (let i = 0; i < mission.objectives.length; i++) {
      const obj = mission.objectives[i];
      if (obj.completed) continue;

      // Check if previous objectives are done
      const prevDone = mission.objectives.slice(0, i).every(o => o.completed);
      if (!prevDone) break;

      // Position-based objectives
      if (obj.targetPosition) {
        const dx = player.position[0] - obj.targetPosition[0];
        const dz = player.position[2] - obj.targetPosition[2];
        if (Math.sqrt(dx * dx + dz * dz) < 4) {
          // If this is an "eliminate" objective, check NPCs
          if (obj.text.toLowerCase().includes('eliminar') || obj.text.toLowerCase().includes('eliminate')) {
            // Don't complete position-based kill objectives by proximity alone
            break;
          }
          completeMissionObjective(mission.id, obj.id);
        }
      }

      // Kill objectives - check if gang NPCs near mission area are dead
      if (obj.text.toLowerCase().includes('eliminar') || obj.text.toLowerCase().includes('eliminate')) {
        const gangAlive = npcs.filter(n => n.type === 'gang' && n.isAlive && n.city === mission.city);
        if (gangAlive.length === 0) {
          completeMissionObjective(mission.id, obj.id);
        }
      }

      break; // Only process first incomplete objective
    }

    // All complete
    if (mission.objectives.every(o => o.completed)) {
      completeMission(mission.id);
    }
  }, [player.position, npcs, activeMission, missions]);
}
