import type { GameState, Mission } from './types';

export type MissionTarget = {
  kind: 'active-objective' | 'available-mission';
  mission: Mission;
  objective: Mission['objectives'][number];
  distance: number;
};

export function getNextObjective(mission: Mission | null) {
  return mission?.objectives.find((objective) => !objective.completed) ?? null;
}

export function getMissionProgress(mission: Mission | null) {
  if (!mission || mission.objectives.length === 0) {
    return { completed: 0, total: 0, ratio: 0 };
  }

  const completed = mission.objectives.filter((objective) => objective.completed).length;
  return {
    completed,
    total: mission.objectives.length,
    ratio: completed / mission.objectives.length,
  };
}

export function getMissionTarget(state: Pick<GameState, 'player' | 'missions' | 'activeMission'>): MissionTarget | null {
  const activeMission = state.missions.find((mission) => mission.id === state.activeMission) ?? null;
  const activeObjective = activeMission?.objectives.find((objective) => !objective.completed && objective.targetPosition) ?? null;

  if (activeMission && activeObjective?.targetPosition) {
    return {
      kind: 'active-objective',
      mission: activeMission,
      objective: activeObjective,
      distance: getDistance2d(state.player.position, activeObjective.targetPosition),
    };
  }

  let nearestMission: Mission | null = null;
  let nearestObjective: Mission['objectives'][number] | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const mission of state.missions) {
    if (mission.status !== 'available') {
      continue;
    }

    const firstObjective = mission.objectives.find((objective) => objective.targetPosition);
    if (!firstObjective?.targetPosition) {
      continue;
    }

    const distance = getDistance2d(state.player.position, firstObjective.targetPosition);
    if (distance < nearestDistance) {
      nearestMission = mission;
      nearestObjective = firstObjective;
      nearestDistance = distance;
    }
  }

  if (!nearestMission || !nearestObjective || !Number.isFinite(nearestDistance)) {
    return null;
  }

  return {
    kind: 'available-mission',
    mission: nearestMission,
    objective: nearestObjective,
    distance: nearestDistance,
  };
}

function getDistance2d(position: [number, number, number], target: [number, number, number]) {
  const dx = target[0] - position[0];
  const dz = target[2] - position[2];
  return Math.sqrt(dx * dx + dz * dz);
}
