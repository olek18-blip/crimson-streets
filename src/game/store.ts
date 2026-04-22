import { create } from 'zustand';
import type { GameState, MissionObjectiveEffect, NPC, PlayerAnimationState, PlayerState } from './types';
import { cities, initialVehicles, initialNPCs, initialMissions } from './worldData';
import { clearSavedGame, loadGameState } from './save';

// const INTRO_MISSION_ID = 'mission1';

const initialPlayer: PlayerState = {
  position: [6, 0.5, -36],
  rotation: -0.42,
  health: 100,
  armor: 0,
  money: 500,
  wantedLevel: 0,
  inVehicle: false,
  currentVehicle: null,
  weapon: 'fist',
  isShooting: false,
  isRunning: false,
  currentCity: 'madrona',
  animationState: 'idle',
};

interface GameStore extends GameState {
  startGame: () => void;
  continueGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  updatePlayerPosition: (pos: [number, number, number]) => void;
  updatePlayerRotation: (rot: number) => void;
  updateNPCTransform: (id: string, position: [number, number, number], rotation: number) => void;
  updateNPCTransforms: (updates: Array<{ id: string; position: [number, number, number]; rotation: number }>) => void;
  setPlayerInVehicle: (vehicleId: string | null) => void;
  takeDamage: (amount: number) => void;
  addMoney: (amount: number) => void;
  setWantedLevel: (level: number) => void;
  setShooting: (shooting: boolean) => void;
  setRunning: (running: boolean) => void;
  setPlayerAnimationState: (animationState: PlayerAnimationState) => void;
  startMission: (id: string) => void;
  completeMissionObjective: (missionId: string, objectiveId: string) => void;
  completeMission: (id: string) => void;
  damageNPC: (id: string, amount: number) => void;
  switchWeapon: () => void;
  registerShot: (weapon: PlayerState['weapon']) => void;
  gameOver: () => void;
  resetGame: () => void;
}

const deepCopy = <T,>(arr: T[]): T[] => JSON.parse(JSON.stringify(arr));

function applyObjectiveEffects(
  player: PlayerState,
  npcs: NPC[],
  effects: MissionObjectiveEffect[] | undefined,
): Pick<GameState, 'player' | 'npcs'> {
  if (!effects?.length) {
    return { player, npcs };
  }

  let nextPlayer = player;
  let nextNPCs = npcs;

  for (const effect of effects) {
    if (effect.type === 'add-money') {
      nextPlayer = { ...nextPlayer, money: nextPlayer.money + effect.amount };
      continue;
    }

    if (effect.type === 'set-min-wanted-level') {
      nextPlayer = {
        ...nextPlayer,
        wantedLevel: Math.max(nextPlayer.wantedLevel, effect.level),
      };
      continue;
    }

    if (effect.type === 'set-wanted-level') {
      nextPlayer = { ...nextPlayer, wantedLevel: effect.level };
      continue;
    }

    if (effect.type === 'set-npc-hostility') {
      nextNPCs = nextNPCs.map((npc) => {
        if (npc.city !== effect.city) {
          return npc;
        }

        if (effect.npcType && npc.type !== effect.npcType) {
          return npc;
        }

        return { ...npc, isHostile: effect.hostile };
      });
    }
  }

  return { player: nextPlayer, npcs: nextNPCs };
}

const createFreshState = (): Omit<GameState, 'screen'> => ({
  player: { ...initialPlayer },
  vehicles: deepCopy(initialVehicles),
  npcs: deepCopy(initialNPCs),
  missions: deepCopy(initialMissions),
  cities,
  activeMission: null,
  timeOfDay: 12,
  lastCompletedMission: null,
  shotTick: 0,
  lastShotWeapon: null,
});

// We keep the intro mission data, but we don't auto-activate it on start anymore.

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'menu',
  ...createFreshState(),

  startGame: () => {
    clearSavedGame();
    set({
      screen: 'playing',
      ...createFreshState(),
    });
  },

  continueGame: () => {
    const saved = loadGameState();

    if (!saved) {
      set({
        screen: 'playing',
        ...createFreshState(),
      });
      return;
    }

    set({
      ...createFreshState(),
      ...saved,
      screen: 'playing',
    });
  },

  pauseGame: () => set({ screen: 'paused' }),

  resumeGame: () =>
    set((state) => ({
      screen: 'playing',
      ...(state.screen === 'mission-complete' ? { lastCompletedMission: null } : {}),
    })),

  updatePlayerPosition: (pos) => {
    let currentCity = 'rural';

    for (const city of cities) {
      const dx = pos[0] - city.center[0];
      const dz = pos[2] - city.center[2];
      if (Math.sqrt(dx * dx + dz * dz) < city.radius) {
        currentCity = city.id;
        break;
      }
    }

    set((state) => ({ player: { ...state.player, position: pos, currentCity } }));
  },

  updatePlayerRotation: (rot) => set((state) => ({ player: { ...state.player, rotation: rot } })),

  updateNPCTransform: (id, position, rotation) =>
    set((state) => ({
      npcs: state.npcs.map((npc) => (npc.id === id ? { ...npc, position, rotation } : npc)),
    })),

  updateNPCTransforms: (updates) =>
    set((state) => {
      if (updates.length === 0) {
        return state;
      }

      const updateMap = new Map(updates.map((update) => [update.id, update]));

      return {
        npcs: state.npcs.map((npc) => {
          const update = updateMap.get(npc.id);
          return update ? { ...npc, position: update.position, rotation: update.rotation } : npc;
        }),
      };
    }),

  setPlayerInVehicle: (vehicleId) =>
    set((state) => ({
      player: { ...state.player, inVehicle: !!vehicleId, currentVehicle: vehicleId },
    })),

  takeDamage: (amount) => {
    const state = get();
    const newHealth = Math.max(0, state.player.health - amount);

    if (newHealth <= 0) {
      set({
        player: { ...state.player, health: 0, animationState: 'death' },
        screen: 'game-over',
      });
      return;
    }

    set({
      player: {
        ...state.player,
        health: newHealth,
        animationState: 'hit',
      },
    });
  },

  addMoney: (amount) => set((state) => ({ player: { ...state.player, money: state.player.money + amount } })),

  setWantedLevel: (level) =>
    set((state) => ({
      player: { ...state.player, wantedLevel: Math.min(5, Math.max(0, level)) },
    })),

  setShooting: (shooting) => set((state) => ({ player: { ...state.player, isShooting: shooting } })),

  setRunning: (running) => set((state) => ({ player: { ...state.player, isRunning: running } })),

  setPlayerAnimationState: (animationState) =>
    set((state) => ({
      player: { ...state.player, animationState },
    })),

  startMission: (id) =>
    set((state) => ({
      activeMission: id,
      missions: state.missions.map((mission) =>
        mission.id === id ? { ...mission, status: 'active' as const } : mission,
      ),
    })),

  completeMissionObjective: (missionId, objectiveId) =>
    set((state) => {
      const mission = state.missions.find((item) => item.id === missionId);
      const objective = mission?.objectives.find((item) => item.id === objectiveId);

      const nextMissions = state.missions.map((existingMission) =>
        existingMission.id === missionId
          ? {
              ...existingMission,
              objectives: existingMission.objectives.map((existingObjective) =>
                existingObjective.id === objectiveId ? { ...existingObjective, completed: true } : existingObjective,
              ),
            }
          : existingMission,
      );

      const nextState = applyObjectiveEffects(state.player, state.npcs, objective?.effects);

      return {
        missions: nextMissions,
        ...nextState,
      };
    }),

  completeMission: (id) => {
    const mission = get().missions.find((item) => item.id === id);

    if (!mission) {
      return;
    }

    set((state) => ({
      screen: 'mission-complete',
      activeMission: null,
      lastCompletedMission: id,
      player: {
        ...state.player,
        money: state.player.money + mission.reward,
        wantedLevel: id === INTRO_MISSION_ID ? 0 : state.player.wantedLevel,
      },
      missions: state.missions.map((item) =>
        item.id === id ? { ...item, status: 'completed' as const } : item,
      ),
    }));
  },

  damageNPC: (id, amount) =>
    set((state) => ({
      npcs: state.npcs.map((npc) => {
        if (npc.id !== id) {
          return npc;
        }

        const newHealth = Math.max(0, npc.health - amount);
        return { ...npc, health: newHealth, isAlive: newHealth > 0 };
      }),
    })),

  switchWeapon: () =>
    set((state) => {
      // Exploration mode: keep weapons simple until attachments/animations are solid.
      const weapons: ('fist' | 'knife')[] = ['fist', 'knife'];
      const currentIndex = weapons.indexOf(state.player.weapon);

      return {
        player: {
          ...state.player,
          weapon: weapons[(currentIndex + 1) % weapons.length] ?? 'fist',
          isShooting: false,
        },
      };
    }),

  registerShot: (weapon) =>
    set((state) => ({
      shotTick: state.shotTick + 1,
      lastShotWeapon: weapon,
    })),

  gameOver: () => set({ screen: 'game-over' }),

  resetGame: () =>
    set({
      screen: 'menu',
      ...createFreshState(),
    }),
}));
