import { create } from 'zustand';
import type { GameState, PlayerState } from './types';
import { cities, initialVehicles, initialNPCs, initialMissions } from './worldData';
import { clearSavedGame, loadGameState } from './save';

const INTRO_MISSION_ID = 'mission1';

const initialPlayer: PlayerState = {
  position: [0, 0.5, 0],
  rotation: 0,
  health: 100,
  armor: 0,
  money: 500,
  wantedLevel: 0,
  inVehicle: false,
  currentVehicle: null,
  weapon: 'pistol',
  isShooting: false,
  isRunning: false,
  currentCity: 'madrona',
};

interface GameStore extends GameState {
  startGame: () => void;
  continueGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  updatePlayerPosition: (pos: [number, number, number]) => void;
  updatePlayerRotation: (rot: number) => void;
  updateNPCTransform: (id: string, position: [number, number, number], rotation: number) => void;
  setPlayerInVehicle: (vehicleId: string | null) => void;
  takeDamage: (amount: number) => void;
  addMoney: (amount: number) => void;
  setWantedLevel: (level: number) => void;
  setShooting: (shooting: boolean) => void;
  setRunning: (running: boolean) => void;
  startMission: (id: string) => void;
  completeMissionObjective: (missionId: string, objectiveId: string) => void;
  completeMission: (id: string) => void;
  damageNPC: (id: string, amount: number) => void;
  switchWeapon: () => void;
  gameOver: () => void;
  resetGame: () => void;
}

const deepCopy = <T,>(arr: T[]): T[] => JSON.parse(JSON.stringify(arr));

const createFreshState = (): Omit<GameState, 'screen'> => ({
  player: { ...initialPlayer },
  vehicles: deepCopy(initialVehicles),
  npcs: deepCopy(initialNPCs),
  missions: deepCopy(initialMissions),
  cities,
  activeMission: null,
  timeOfDay: 12,
  lastCompletedMission: null,
});

const createIntroState = (): Omit<GameState, 'screen'> => {
  const state = createFreshState();
  return {
    ...state,
    activeMission: INTRO_MISSION_ID,
    missions: state.missions.map((mission) =>
      mission.id === INTRO_MISSION_ID ? { ...mission, status: 'active' as const } : mission,
    ),
  };
};

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'menu',
  ...createFreshState(),

  startGame: () => {
    clearSavedGame();
    set({
      screen: 'playing',
      ...createIntroState(),
    });
  },

  continueGame: () => {
    const saved = loadGameState();

    if (!saved) {
      set({
        screen: 'playing',
        ...createIntroState(),
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

  setPlayerInVehicle: (vehicleId) =>
    set((state) => ({
      player: { ...state.player, inVehicle: !!vehicleId, currentVehicle: vehicleId },
    })),

  takeDamage: (amount) => {
    const state = get();
    const newHealth = Math.max(0, state.player.health - amount);

    if (newHealth <= 0) {
      set({ player: { ...state.player, health: 0 }, screen: 'game-over' });
      return;
    }

    set({ player: { ...state.player, health: newHealth } });
  },

  addMoney: (amount) => set((state) => ({ player: { ...state.player, money: state.player.money + amount } })),

  setWantedLevel: (level) =>
    set((state) => ({
      player: { ...state.player, wantedLevel: Math.min(5, Math.max(0, level)) },
    })),

  setShooting: (shooting) => set((state) => ({ player: { ...state.player, isShooting: shooting } })),

  setRunning: (running) => set((state) => ({ player: { ...state.player, isRunning: running } })),

  startMission: (id) =>
    set((state) => ({
      activeMission: id,
      missions: state.missions.map((mission) =>
        mission.id === id ? { ...mission, status: 'active' as const } : mission,
      ),
    })),

  completeMissionObjective: (missionId, objectiveId) =>
    set((state) => ({
      missions: state.missions.map((mission) =>
        mission.id === missionId
          ? {
              ...mission,
              objectives: mission.objectives.map((objective) =>
                objective.id === objectiveId ? { ...objective, completed: true } : objective,
              ),
            }
          : mission,
      ),
    })),

  completeMission: (id) => {
    const mission = get().missions.find((item) => item.id === id);

    if (!mission) {
      return;
    }

    set((state) => ({
      screen: 'mission-complete',
      activeMission: null,
      lastCompletedMission: id,
      player: { ...state.player, money: state.player.money + mission.reward },
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
      const weapons: ('fist' | 'pistol' | 'rifle')[] = ['fist', 'pistol', 'rifle'];
      const currentIndex = weapons.indexOf(state.player.weapon);

      return {
        player: {
          ...state.player,
          weapon: weapons[(currentIndex + 1) % weapons.length],
        },
      };
    }),

  gameOver: () => set({ screen: 'game-over' }),

  resetGame: () =>
    set({
      screen: 'menu',
      ...createFreshState(),
    }),
}));
