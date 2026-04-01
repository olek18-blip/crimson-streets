import { create } from 'zustand';
import type { GameState, PlayerState, Vehicle, NPC, Mission } from './types';

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
};

const initialVehicles: Vehicle[] = [
  { id: 'car1', type: 'car', position: [8, 0.4, 5], rotation: 0, color: '#cc2222', speed: 0 },
  { id: 'car2', type: 'car', position: [-10, 0.4, -8], rotation: Math.PI / 2, color: '#2244aa', speed: 0 },
  { id: 'moto1', type: 'motorcycle', position: [15, 0.3, -3], rotation: Math.PI, color: '#222222', speed: 0 },
  { id: 'car3', type: 'car', position: [-5, 0.4, 20], rotation: -Math.PI / 4, color: '#eeee33', speed: 0 },
];

const initialNPCs: NPC[] = [
  { id: 'civ1', type: 'civilian', position: [5, 0.5, 3], rotation: 0, health: 100, isHostile: false, isAlive: true },
  { id: 'civ2', type: 'civilian', position: [-3, 0.5, 7], rotation: 1.5, health: 100, isHostile: false, isAlive: true },
  { id: 'civ3', type: 'civilian', position: [12, 0.5, -5], rotation: 3, health: 100, isHostile: false, isAlive: true },
  { id: 'police1', type: 'police', position: [-15, 0.5, -15], rotation: 0, health: 150, isHostile: false, isAlive: true },
  { id: 'gang1', type: 'gang', position: [20, 0.5, 15], rotation: 2, health: 120, isHostile: false, isAlive: true },
  { id: 'gang2', type: 'gang', position: [22, 0.5, 17], rotation: 1, health: 120, isHostile: false, isAlive: true },
];

const initialMissions: Mission[] = [
  {
    id: 'mission1',
    title: 'The First Score',
    description: 'Meet the contact near the warehouse district. A drug shipment needs intercepting.',
    objectives: [
      { id: 'obj1', text: 'Go to the warehouse (marked area)', completed: false, targetPosition: [20, 0, 15] },
      { id: 'obj2', text: 'Eliminate the gang members', completed: false },
      { id: 'obj3', text: 'Collect the evidence', completed: false, targetPosition: [22, 0, 17] },
    ],
    status: 'available',
    reward: 5000,
  },
];

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

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'menu',
  player: { ...initialPlayer },
  vehicles: initialVehicles.map(v => ({ ...v })),
  npcs: initialNPCs.map(n => ({ ...n })),
  missions: initialMissions.map(m => ({ ...m, objectives: m.objectives.map(o => ({ ...o })) })),
  activeMission: null,
  timeOfDay: 12,

  startGame: () => set({ screen: 'playing' }),
  pauseGame: () => set({ screen: 'paused' }),
  resumeGame: () => set({ screen: 'playing' }),
  
  updatePlayerPosition: (pos) => set(s => ({ player: { ...s.player, position: pos } })),
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
    missions: s.missions.map(m => m.id === id ? { ...m, status: 'active' } : m),
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
        missions: s.missions.map(m => m.id === id ? { ...m, status: 'completed' } : m),
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
    vehicles: initialVehicles.map(v => ({ ...v })),
    npcs: initialNPCs.map(n => ({ ...n })),
    missions: initialMissions.map(m => ({ ...m, objectives: m.objectives.map(o => ({ ...o })) })),
    activeMission: null,
  }),
}));
