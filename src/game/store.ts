import { create } from 'zustand';
import type { GameState, PlayerState } from './types';
import { cities, initialVehicles, initialNPCs, initialMissions } from './worldData';

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
  pauseGame: () => void;
  resumeGame: () => void;
  updatePlayerPosition: (pos: [number, number, number]) => void;
  updatePlayerRotation: (rot: number) => void;
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

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'menu',
  player: { ...initialPlayer },
  vehicles: deepCopy(initialVehicles),
  npcs: deepCopy(initialNPCs),
  missions: deepCopy(initialMissions),
  cities: cities,
  activeMission: null,
  timeOfDay: 12,

  startGame: () => set({ screen: 'playing' }),
  pauseGame: () => set({ screen: 'paused' }),
  resumeGame: () => set({ screen: 'playing' }),
  
  updatePlayerPosition: (pos) => {
    // Determine current city
    let currentCity = 'rural';
    for (const city of cities) {
      const dx = pos[0] - city.center[0];
      const dz = pos[2] - city.center[2];
      if (Math.sqrt(dx * dx + dz * dz) < city.radius) {
        currentCity = city.id;
        break;
      }
    }
    set(s => ({ player: { ...s.player, position: pos, currentCity } }));
  },
  updatePlayerRotation: (rot) => set(s => ({ player: { ...s.player, rotation: rot } })),
  
  setPlayerInVehicle: (vehicleId) => set(s => ({
    player: { ...s.player, inVehicle: !!vehicleId, currentVehicle: vehicleId }
  })),
  
  takeDamage: (amount) => {
    const s = get();
    const newHealth = Math.max(0, s.player.health - amount);
    if (newHealth <= 0) {
      set({ player: { ...s.player, health: 0 }, screen: 'game-over' });
    } else {
      set({ player: { ...s.player, health: newHealth } });
    }
  },
  
  addMoney: (amount) => set(s => ({ player: { ...s.player, money: s.player.money + amount } })),
  setWantedLevel: (level) => set(s => ({ player: { ...s.player, wantedLevel: Math.min(5, Math.max(0, level)) } })),
  setShooting: (shooting) => set(s => ({ player: { ...s.player, isShooting: shooting } })),
  setRunning: (running) => set(s => ({ player: { ...s.player, isRunning: running } })),
  
  startMission: (id) => set(s => ({
    activeMission: id,
    missions: s.missions.map(m => m.id === id ? { ...m, status: 'active' as const } : m),
  })),
  
  completeMissionObjective: (missionId, objectiveId) => set(s => ({
    missions: s.missions.map(m => m.id === missionId ? {
      ...m,
      objectives: m.objectives.map(o => o.id === objectiveId ? { ...o, completed: true } : o),
    } : m),
  })),
  
  completeMission: (id) => {
    const mission = get().missions.find(m => m.id === id);
    if (mission) {
      set(s => ({
        screen: 'mission-complete',
        activeMission: null,
        player: { ...s.player, money: s.player.money + mission.reward },
        missions: s.missions.map(m => m.id === id ? { ...m, status: 'completed' as const } : m),
      }));
    }
  },
  
  damageNPC: (id, amount) => set(s => ({
    npcs: s.npcs.map(n => {
      if (n.id !== id) return n;
      const newHealth = Math.max(0, n.health - amount);
      return { ...n, health: newHealth, isAlive: newHealth > 0 };
    }),
  })),
  
  switchWeapon: () => set(s => {
    const weapons: ('fist' | 'pistol' | 'rifle')[] = ['fist', 'pistol', 'rifle'];
    const idx = weapons.indexOf(s.player.weapon);
    return { player: { ...s.player, weapon: weapons[(idx + 1) % weapons.length] } };
  }),
  
  gameOver: () => set({ screen: 'game-over' }),
  
  resetGame: () => set({
    screen: 'menu',
    player: { ...initialPlayer },
    vehicles: deepCopy(initialVehicles),
    npcs: deepCopy(initialNPCs),
    missions: deepCopy(initialMissions),
    activeMission: null,
  }),
}));
