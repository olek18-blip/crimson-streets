import { useEffect } from 'react';
import { useGameStore } from '../game/store';

export function useMissionSystem() {
  const { player, missions, activeMission, startMission, completeMissionObjective, completeMission, npcs } = useGameStore();

  useEffect(() => {
    if (!activeMission) {
      for (const mission of missions) {
        if (mission.status !== 'available') continue;
        const firstObjective = mission.objectives[0];
        if (!firstObjective?.targetPosition) continue;
        const triggerRadius = firstObjective.radius ?? 5;

        const dx = player.position[0] - firstObjective.targetPosition[0];
        const dz = player.position[2] - firstObjective.targetPosition[2];
        if (Math.sqrt(dx * dx + dz * dz) < triggerRadius) {
          startMission(mission.id);
          break;
        }
      }
      return;
    }

    const mission = missions.find((item) => item.id === activeMission);
    if (!mission) return;

    for (let index = 0; index < mission.objectives.length; index += 1) {
      const objective = mission.objectives[index];
      if (objective.completed) continue;

      const previousDone = mission.objectives.slice(0, index).every((item) => item.completed);
      if (!previousDone) break;

      const objectiveType = objective.objectiveType ?? (objective.text.toLowerCase().includes('eliminar') || objective.text.toLowerCase().includes('eliminate') ? 'eliminate-gangs' : 'reach');

      if (objectiveType === 'reach' && objective.targetPosition) {
        const completionRadius = objective.radius ?? 4;
        const dx = player.position[0] - objective.targetPosition[0];
        const dz = player.position[2] - objective.targetPosition[2];
        if (Math.sqrt(dx * dx + dz * dz) < completionRadius) {
          completeMissionObjective(mission.id, objective.id);
        }
      }

      if (objectiveType === 'switch-weapon' && player.weapon !== 'fist') {
        completeMissionObjective(mission.id, objective.id);
      }

      if (objectiveType === 'enter-vehicle' && player.inVehicle) {
        completeMissionObjective(mission.id, objective.id);
      }

      if (objectiveType === 'eliminate-gangs') {
        const gangAlive = npcs.filter((npc) => npc.type === 'gang' && npc.isAlive && npc.city === mission.city);
        if (gangAlive.length === 0) {
          completeMissionObjective(mission.id, objective.id);
        }
      }

      break;
    }

    if (mission.objectives.every((objective) => objective.completed)) {
      completeMission(mission.id);
    }
  }, [player.position, player.weapon, player.inVehicle, npcs, activeMission, missions, startMission, completeMissionObjective, completeMission]);
}
